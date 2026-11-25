import { defineCollection } from 'astro:content';
import type { SchemaContext } from 'astro/content/config';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// --- Shared types ---------------------------------------------------------

const text = z.string().trim().min(1);

/** Every visible string carries both languages; strict so a typo like `kr:` fails. */
const localized = z.strictObject({ en: text, ko: text });

const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM');

// YAML parses an unquoted 2024-03-15 as a Date; normalize it back to a string.
const dayOrMonth = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().regex(/^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/, 'Use YYYY-MM-DD or YYYY-MM'),
);

/**
 * status: present -> ongoing, no `end`. planned -> `end` is a planned date.
 * No status: `end` is a real end date (or omitted for a single month).
 */
const period = z
  .strictObject({
    start: month,
    end: month.optional(),
    status: z.enum(['present', 'planned']).optional(),
  })
  .superRefine((p, ctx) => {
    if (p.status === 'present' && p.end)
      ctx.addIssue({ code: 'custom', message: 'status "present" must not have an end' });
    if (p.status === 'planned' && !p.end)
      ctx.addIssue({ code: 'custom', message: 'status "planned" needs an end' });
    if (p.end && p.end < p.start) ctx.addIssue({ code: 'custom', message: 'end is before start' });
  });

// CLAUDE.md rule 3: only these clients may appear by name. Adding one needs user approval.
const APPROVED_CLIENTS = ['Samsung Electronics', 'LOTTE Fine Chemical'] as const;

/** Public clients carry `name`; anonymous clients carry only an industry `label`. Strict, so no name can leak into an anonymous entry. */
const client = z.discriminatedUnion('public', [
  z.strictObject({
    public: z.literal(true),
    name: z.strictObject({ en: z.enum(APPROVED_CLIENTS), ko: text }),
  }),
  z.strictObject({ public: z.literal(false), label: localized }),
]);

// basic-plan 4.3
export const DOMAINS = [
  'Energy & Utilities',
  'Manufacturing',
  'Petrochemical & Steel',
  'Healthcare',
  'Robotics',
  'Public & Legal',
] as const;
export const CAPABILITIES = [
  'Physical AI',
  'LLM Agents & RAG',
  'Anomaly Detection',
  'Forecasting',
  'Control & Optimization',
  'Computer Vision',
  'MLOps',
] as const;

// Files are maps keyed by entry id (`genon: {...}`), not arrays: the file loader silently drops array items without `id`.
// The file loader only logs invalid YAML / missing files and keeps going (stale cache or empty section), so fail the build on any loader error.
const data = (name: string) => {
  const loader = file(`src/content/${name}.yaml`);
  return {
    ...loader,
    load: async (ctx: Parameters<typeof loader.load>[0]) => {
      let failed = false;
      const logger = Object.create(ctx.logger);
      logger.error = (msg: string) => {
        failed = true;
        ctx.logger.error(msg);
      };
      await loader.load({ ...ctx, logger });
      if (failed) throw new Error(`src/content/${name}.yaml could not be loaded (invalid YAML?)`);
    },
  };
};

// --- Collections ----------------------------------------------------------

const profile = defineCollection({
  loader: glob({ pattern: 'profile.yaml', base: './src/content' }),
  schema: z.strictObject({
    name: localized,
    headline: localized,
    currentRole: localized,
    contact: z.strictObject({ email: z.email(), github: z.url(), linkedin: z.url() }),
    about: localized,
    taglines: z.array(localized).min(1).max(3),
    trajectory: z
      .array(z.strictObject({ label: localized, years: text, description: localized }))
      .length(4),
    skills: z.array(z.strictObject({ label: localized, summary: localized })).min(1),
    availability: z.array(localized).min(3).max(5),
  }),
});

const experience = defineCollection({
  loader: data('experience'),
  schema: z.strictObject({
    org: localized,
    role: localized,
    period,
    summary: localized,
  }),
});

/** basic-plan 4.4. Each section is 1–4 bullets; Stack is the project's `stack` field. */
const bullets = z.array(localized).min(1).max(4);

/** Conceptual diagram as data (task 1.5.4), rendered once G4 picks a design. Flows reference layer ids. */
const architecture = z
  .strictObject({
    layers: z
      .array(z.strictObject({ id: text, label: localized, nodes: z.array(localized).min(1) }))
      .min(2),
    flows: z
      .array(z.strictObject({ from: text, to: text, label: localized.optional() }))
      .optional(),
  })
  .superRefine((a, ctx) => {
    const ids = new Set(a.layers.map((l) => l.id));
    if (ids.size !== a.layers.length)
      ctx.addIssue({ code: 'custom', message: 'duplicate layer id' });
    for (const f of a.flows ?? [])
      for (const end of [f.from, f.to])
        if (!ids.has(end)) ctx.addIssue({ code: 'custom', message: `unknown layer id "${end}"` });
  });

// --- Case study diagrams (DESIGN.md 5.24.4) --------------------------------
// One file per case study: src/content/diagrams/<slug>.yaml. Coordinates are SVG units on a 4px grid.
// kind: sllm = fine-tuned small model (accent), llm = general LLM, logic = search/DB/rules, plain = component, input = user end,
// focus = the one accented step when there is no sLLM (accent fill), new = added in this version (accent outline),
// step = an automated step that is not an LLM (strong outline, like llm), decision = a yes/no check (diamond),
// ghost = a layer the path skips or a system left unconnected (faint dotted outline).
const DG_KINDS = [
  'sllm',
  'llm',
  'logic',
  'plain',
  'input',
  'focus',
  'new',
  'step',
  'decision',
  'ghost',
] as const;
// Legend swatches: a node kind, a pain-point mark, a journey touchpoint dot, the accent (safety) connector,
// a dashed connector (dash-line), or the dashed accent divider (acc-dash).
const DG_LEGEND = z
  .array(
    z.strictObject({
      kind: z.enum([
        ...DG_KINDS,
        'mark',
        'dot-own',
        'dot-out',
        'acc-line',
        'dash-line',
        'acc-dash',
      ]),
      label: localized,
    }),
  )
  .min(1);
const rect = { x: z.number(), y: z.number(), w: z.number().positive(), h: z.number().positive() };

const diagram = z
  .strictObject({
    width: z.number().positive(),
    height: z.number().positive(),
    legend: DG_LEGEND.optional(), // replaces the file-level legend for this diagram
    // Stage strip along the top (customer journey): one chevron of width w per item, from x.
    stages: z
      .strictObject({
        x: z.number(),
        y: z.number(),
        w: z.number().positive(),
        h: z.number().positive(),
        items: z.array(localized).min(2),
      })
      .optional(),
    // center: an incoming connector runs through the label, so it sits centered on the line over a mask.
    // note: short text right-aligned in the zone header (e.g. a metric); accent marks the headline one.
    // dash: an area marked on a floor plan (dashed outline, no wash).
    zones: z
      .array(
        z.strictObject({
          id: text,
          label: localized,
          center: z.boolean().default(false),
          dash: z.boolean().default(false),
          note: z.strictObject({ text: localized, accent: z.boolean().default(false) }).optional(),
          ...rect,
        }),
      )
      .default([]),
    nodes: z
      .array(
        z.strictObject({
          id: text,
          kind: z.enum(DG_KINDS),
          label: localized, // "\n" breaks the line
          sub: localized.optional(),
          ...rect,
        }),
      )
      .default([]),
    // Customer journey: a path (curve) through touchpoint dots. own = the client's channel (filled), out = outside (hollow).
    curve: text.optional(),
    dots: z
      .array(
        z.strictObject({
          id: text,
          lane: z.enum(['own', 'out']),
          label: localized,
          x: z.number(),
          y: z.number(),
        }),
      )
      .default([]),
    // Numbered pain points: a box with a quote, pointing at (px, py) near the dot or node `on`.
    callouts: z
      .array(
        z.strictObject({
          n: z.number().int().positive(),
          on: text,
          text: localized,
          px: z.number(),
          py: z.number(),
          ...rect,
        }),
      )
      .default([]),
    // Floor plan stops: a numbered accent marker at (x, y) — a pill when n is wider than one digit — with an optional
    // name and sublabel at (lx, ly). Edges may name a mark's id. Read in order as the path by screen readers.
    marks: z
      .array(
        z.strictObject({
          id: text,
          n: text,
          x: z.number(),
          y: z.number(),
          label: localized.optional(),
          sub: localized.optional(),
          lx: z.number().optional(),
          ly: z.number().optional(),
          anchor: z.enum(['start', 'middle', 'end']).default('start'),
        }),
      )
      .default([]),
    route: text.optional(), // a thick stroke under the connectors (e.g. the walking stretch of a route)
    // Distance rings around a point (e.g. slow-down and stop distances); the accent ring is the hard limit.
    rings: z
      .strictObject({
        x: z.number(),
        y: z.number(),
        center: localized,
        items: z
          .array(
            z.strictObject({
              r: z.number().positive(),
              label: localized,
              accent: z.boolean().default(false),
            }),
          )
          .min(1),
      })
      .optional(),
    // Small mono captions placed in the drawing (also read by screen readers).
    // style name: a 12px row label instead of the mono caption; bullet: a small dot 12px to its left (e.g. on a spine line).
    texts: z
      .array(
        z.strictObject({
          text: localized,
          x: z.number(),
          y: z.number(),
          anchor: z.enum(['start', 'middle', 'end']).default('start'),
          style: z.enum(['note', 'name']).default('note'),
          bullet: z.boolean().default(false),
        }),
      )
      .default([]),
    // A dashed accent line across the drawing at y, with its label centered at x (e.g. the line customization stays above).
    divider: z.strictObject({ y: z.number(), x: z.number(), label: localized }).optional(),
    // from/to name a node or zone (read by screen readers); d is the drawn path.
    // style: back = dashed return, both = arrowheads at both ends, acc = the accent path (one per diagram, e.g. a safety channel),
    // dash = dashed one-way (an optional or remote link), remote = dashed with arrowheads at both ends,
    // line = no arrowhead (a spine that labels hang from; not read as a connection).
    edges: z
      .array(
        z.strictObject({
          from: text,
          to: text,
          d: text,
          style: z.enum(['back', 'both', 'acc', 'dash', 'remote', 'line']).optional(),
          label: z
            .strictObject({
              text: localized,
              x: z.number(),
              y: z.number(),
              anchor: z.enum(['start', 'middle', 'end']).default('middle'), // every edge label sits on a mask
            })
            .optional(),
        }),
      )
      .default([]),
  })
  .superRefine((d, ctx) => {
    const ids = [...d.zones, ...d.nodes, ...d.dots, ...d.marks].map((n) => n.id);
    if (new Set(ids).size !== ids.length)
      ctx.addIssue({ code: 'custom', message: 'duplicate diagram id' });
    if (!d.nodes.length && !d.dots.length)
      ctx.addIssue({ code: 'custom', message: 'a diagram needs nodes or dots' });
    for (const end of [...d.edges.flatMap((e) => [e.from, e.to]), ...d.callouts.map((c) => c.on)])
      if (!ids.includes(end))
        ctx.addIssue({ code: 'custom', message: `unknown diagram id "${end}"` });
  });

// Experiment results under the Approach bullets (DESIGN.md 5.24.6): error bar per configuration on a 0–max % axis,
// plus a matrix of which settings each model configuration used. Rule-based rows have no settings.
const results = z
  .strictObject({
    max: z.number().positive(), // axis end in %
    ticks: z.array(z.number()).min(2),
    target: z.strictObject({ value: z.number(), label: localized }),
    benchmark: z.strictObject({ value: z.number(), label: localized }),
    ruleNote: localized, // shown in the matrix for rule-based rows
    // short: matrix column head, name: screen-reader table head
    settings: z.array(z.strictObject({ short: localized, name: localized })).min(1),
    rows: z
      .array(
        z.strictObject({
          label: localized,
          mape: z.number().nonnegative(),
          rule: z.boolean().default(false),
          set: z.array(z.boolean()).optional(),
          best: z.boolean().default(false),
        }),
      )
      .min(2),
    note: localized,
  })
  .superRefine((r, ctx) => {
    for (const row of r.rows) {
      if (row.rule === !!row.set)
        ctx.addIssue({
          code: 'custom',
          message: `"${row.label.en}": rule rows have no set, model rows need one`,
        });
      if (row.set && row.set.length !== r.settings.length)
        ctx.addIssue({
          code: 'custom',
          message: `"${row.label.en}": set length must match settings`,
        });
      if (row.mape > r.max)
        ctx.addIssue({ code: 'custom', message: `"${row.label.en}": mape above max` });
    }
    if (r.rows.filter((row) => row.best).length > 1)
      ctx.addIssue({ code: 'custom', message: 'at most one best row' });
  });

// Layer stack (DESIGN.md 5.24.9): one command stepping down through layers, each with the data it hands on.
// sample picks the drawing of that output: coords (a 3D point), chunk (steps × joints grid), joints (one tick per joint),
// torque (the control law in mono). value is the text drawn for coords and torque.
const stack = z.strictObject({
  command: localized,
  descent: localized, // one line over the drawing (e.g. less information, more precision)
  layers: z
    .array(
      z.strictObject({
        name: localized,
        does: localized,
        where: localized,
        out: localized, // label over the sample
        sample: z.enum(['coords', 'chunk', 'joints', 'torque']),
        value: text.optional(),
        focus: z.boolean().default(false),
      }),
    )
    .min(2)
    .max(5),
  note: localized,
});

// Episode anatomy (DESIGN.md 5.24.10): one demonstration as five recorded tracks over labeled segments,
// then the training loop that consumes it, with the accent return path for runs below target.
const episode = z.strictObject({
  segments: z.array(localized).min(2).max(5),
  tracks: z.array(z.strictObject({ name: localized, key: text })).length(5), // language, vision, state, action, outcome
  instruction: localized,
  result: localized,
  steps: z
    .array(z.strictObject({ name: localized, sub: localized, focus: z.boolean().default(false) }))
    .length(4),
  back: localized, // label on the return path
  metrics: localized,
  note: localized,
});

// Repository map (DESIGN.md 5.24.13): a folder tree, one file opened with its lines, notes on what each part is used for,
// and the commit message convention. notes[].from/to are line indexes (bracketed range).
const repomap = z
  .strictObject({
    repo: localized, // tree area label
    tree: z
      .array(
        z.strictObject({
          depth: z.number().int().min(0).max(2),
          name: text,
          focus: z.boolean().default(false), // the file that is opened
        }),
      )
      .min(2),
    treeNote: z.array(localized).max(2).default([]),
    open: localized, // label on the arrow from the tree to the file
    file: localized, // file area label
    path: text,
    lines: z
      .array(
        z.strictObject({ text: text, kind: z.enum(['plain', 'muted', 'head']).default('plain') }),
      )
      .min(2)
      .max(14),
    notes: z
      .array(
        z.strictObject({
          from: z.number().int().nonnegative(),
          to: z.number().int().nonnegative(),
          title: localized,
          body: localized,
        }),
      )
      .max(4),
    commit: z.strictObject({ label: localized, text: text, note: localized }),
  })
  .superRefine((r, ctx) => {
    if (r.tree.filter((t) => t.focus).length !== 1)
      ctx.addIssue({ code: 'custom', message: 'repomap: exactly one focus row' });
    for (const n of r.notes)
      if (n.from > n.to || n.to >= r.lines.length)
        ctx.addIssue({ code: 'custom', message: `repomap: bad note range ${n.from}-${n.to}` });
  });

// Roadmap figures (DESIGN.md 5.24.14–16) share task kinds: own = a task our team ran (the one accent),
// poc / sol / dev = how a task is run (PoC, proven solution, development prep), add = a task we added.
const TASK_KINDS = ['own', 'poc', 'sol', 'dev', 'add'] as const;
const kindLegend = z.array(z.strictObject({ kind: z.enum(TASK_KINDS), label: localized })).min(1);

// Task selection as unit grids (DESIGN.md 5.24.14): one panel per stage, one square per task.
// grid: small cells, `of` in all with `picked` dark (split: the first n of a full grid a shade darker, e.g. round 1);
// units: larger squares by kind, named ones listed one per row. step: label on the arrow to the next stage.
const selection = z
  .strictObject({
    stages: z
      .array(
        z.strictObject({
          count: z.number().int().positive(),
          name: localized,
          sub: localized,
          grid: z
            .strictObject({
              of: z.number().int().positive().max(168),
              picked: z.number().int().positive(),
              split: z.number().int().positive().optional(),
            })
            .optional(),
          units: z
            .array(
              z.strictObject({
                kind: z.enum(TASK_KINDS),
                n: z.number().int().positive().default(1),
                name: localized.optional(),
              }),
            )
            .optional(),
          step: localized.optional(),
        }),
      )
      .min(2)
      .max(5),
    legend: kindLegend,
  })
  .superRefine((s, ctx) => {
    s.stages.forEach((st, i) => {
      const at = `selection stage ${i + 1}`;
      if (!st.grid === !st.units) ctx.addIssue({ code: 'custom', message: `${at}: grid or units` });
      const n = st.grid ? st.grid.picked : (st.units ?? []).reduce((a, u) => a + u.n, 0);
      if (n !== st.count)
        ctx.addIssue({ code: 'custom', message: `${at}: count ${st.count} ≠ ${n}` });
      if (st.grid && st.grid.picked > st.grid.of)
        ctx.addIssue({ code: 'custom', message: `${at}: picked > of` });
      const named = (st.units ?? []).filter((u) => u.name);
      if (named.length && (named.length !== st.units!.length || named.length > 4))
        ctx.addIssue({ code: 'custom', message: `${at}: name all units (≤4) or none` });
      if (st.units && !named.length && n > 36)
        ctx.addIssue({ code: 'custom', message: `${at}: ≤36 units` });
      if (!st.step !== (i === s.stages.length - 1))
        ctx.addIssue({ code: 'custom', message: `${at}: step on every stage but the last` });
    });
  });

// Quadrant matrix (DESIGN.md 5.24.15): four named cells on two axes (x low→high left to right, y low→high
// bottom to top), at most one focus cell. body is two lines split by \n; note is the mono line at the bottom (e.g. examples).
const matrix = z
  .strictObject({
    x: localized,
    y: localized,
    cells: z
      .array(
        z.strictObject({
          at: z.enum(['tl', 'tr', 'bl', 'br']),
          name: localized,
          count: z.number().int().nonnegative(),
          body: localized,
          note: localized,
          focus: z.boolean().default(false),
        }),
      )
      .length(4),
  })
  .superRefine((m, ctx) => {
    if (new Set(m.cells.map((c) => c.at)).size !== 4)
      ctx.addIssue({ code: 'custom', message: 'matrix: one cell per corner' });
    if (m.cells.filter((c) => c.focus).length > 1)
      ctx.addIssue({ code: 'custom', message: 'matrix: at most one focus cell' });
  });

// Roadmap Gantt (DESIGN.md 5.24.16): lanes over quarters from January of `start` (from/to in quarters, half steps);
// the component packs bars into rows. notes: a short caption in a lane's empty stretch, at a quarter mark.
const gantt = z
  .strictObject({
    start: z.number().int(),
    years: z.number().int().min(1).max(3),
    lanes: z
      .array(z.strictObject({ id: text, label: localized }))
      .min(1)
      .max(6),
    tasks: z
      .array(
        z.strictObject({
          lane: text,
          kind: z.enum(TASK_KINDS),
          from: z.number().nonnegative().multipleOf(0.5),
          to: z.number().positive().multipleOf(0.5),
          name: localized,
        }),
      )
      .min(1),
    notes: z
      .array(
        z.strictObject({
          lane: text,
          at: z.number().nonnegative(),
          anchor: z.enum(['start', 'end']).default('start'),
          text: localized,
        }),
      )
      .default([]),
    legend: kindLegend,
  })
  .superRefine((g, ctx) => {
    const ids = new Set(g.lanes.map((l) => l.id));
    if (ids.size !== g.lanes.length)
      ctx.addIssue({ code: 'custom', message: 'gantt: duplicate lane id' });
    for (const k of g.tasks) {
      if (!ids.has(k.lane))
        ctx.addIssue({ code: 'custom', message: `gantt: unknown lane "${k.lane}"` });
      if (k.from >= k.to || k.to > g.years * 4)
        ctx.addIssue({ code: 'custom', message: `gantt: bad span for "${k.name.en}"` });
    }
    for (const n of g.notes)
      if (!ids.has(n.lane) || n.at > g.years * 4)
        ctx.addIssue({ code: 'custom', message: `gantt: bad note "${n.text.en}"` });
  });

const diagrams = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/diagrams' }),
  schema: z.strictObject({
    // Default legend; a diagram's own `legend` replaces it. A file with only charts (results, selection, gantt) has none.
    legend: DG_LEGEND.default([]),
    problem: diagram.optional(), // above the Problem bullets (e.g. customer journey)
    approach: diagram.optional(), // below the Approach bullets (e.g. architecture versions)
    arch: diagram.optional(), // Architecture section; replaces the caseStudy.architecture table
    flow: diagram.optional(), // Service flow section
    journey: diagram.optional(), // Visitor journey section (floor plan), before Architecture
    safety: diagram.optional(), // Safety section, after Service flow
    results: results.optional(), // experiment results chart under the Approach bullets
    stack: stack.optional(), // its own section after Approach (5.24.9)
    episode: episode.optional(), // Learning loop section before Outcome (5.24.10)
    prompt: diagram.optional(), // System prompt section after Approach (5.24.3)
    repomap: repomap.optional(), // System prompt section, under the prompt diagram (5.24.13)
    selection: selection.optional(), // task selection under the Approach bullets (5.24.14)
    matrix: matrix.optional(), // under the selection (5.24.15)
    gantt: gantt.optional(), // Roadmap section before Outcome (5.24.16)
  }),
});

type ImageFn = SchemaContext['image'];

// Option comparison under Key decisions (DESIGN.md 5.24.7): one product image per option, rows of criteria,
// the picked column marked. Images are the makers' product shots, so `credit` names them.
const compare = (image: ImageFn) =>
  z
    .strictObject({
      title: localized,
      // Without images (both or neither) the table stands alone; without pick neither column is marked (5.24.7).
      options: z
        .array(
          z.strictObject({
            name: z.union([text, localized]),
            image: image().optional(),
            alt: localized.optional(),
          }),
        )
        .length(2),
      pick: z.number().int().min(0).max(1).optional(),
      rows: z
        .array(z.strictObject({ label: localized, values: z.array(localized).length(2) }))
        .min(2),
      verdict: localized,
      credit: localized.optional(),
    })
    .superRefine((c, ctx) => {
      const imgs = c.options.filter((o) => o.image && o.alt).length;
      if (imgs === 1 || c.options.some((o) => !!o.image !== !!o.alt))
        ctx.addIssue({
          code: 'custom',
          message: 'compare: images and alt on both options or neither',
        });
      if (imgs === 2 && !c.credit)
        ctx.addIssue({ code: 'custom', message: 'compare: product images need a credit' });
    });

// Live service screens under the Context bullets (DESIGN.md 5.24.17): crops of one real answer, top to bottom,
// each with numbered notes pinned at a height (at, % of the crop), the omitted middle named in gap, and a captioned link.
const screens = (image: ImageFn) =>
  z.strictObject({
    slices: z
      .array(
        z.strictObject({
          image: image(),
          alt: localized,
          notes: z
            .array(
              z.strictObject({ at: z.number().min(0).max(100), title: localized, body: localized }),
            )
            .min(1)
            .max(3),
        }),
      )
      .min(1)
      .max(3),
    gap: localized.optional(), // between slices: what was left out
    caption: localized,
    url: z.url(),
  });

// Who does each task at each stage (DESIGN.md 5.24.8): tasks in order, and per stage how many from the start the robot takes.
const roadmap = z
  .strictObject({
    title: localized,
    tasks: z.array(localized).min(2).max(6), // "\n" breaks the column head
    stages: z
      .array(z.strictObject({ label: localized, robot: z.number().int().nonnegative() }))
      .min(2)
      .max(4),
    note: localized,
  })
  .superRefine((r, ctx) => {
    for (const s of r.stages)
      if (s.robot > r.tasks.length)
        ctx.addIssue({ code: 'custom', message: `"${s.label.en}": robot exceeds the task count` });
  });

// Domain comparison under the Approach diagram (DESIGN.md 5.24.11): one row per domain with a status badge.
// status: done (accent), draft, todo (dashed).
const domains = z.strictObject({
  title: localized,
  heads: z.strictObject({
    domain: localized,
    basic: localized,
    tech: localized,
    measure: localized,
  }),
  items: z
    .array(
      z.strictObject({
        name: localized,
        focus: localized,
        status: z.strictObject({ kind: z.enum(['done', 'draft', 'todo']), label: localized }),
        basic: localized,
        option: localized,
        tech: localized,
        measure: localized,
      }),
    )
    .min(2)
    .max(4),
  note: localized,
});

// Standard delivery set under the Architecture diagram (DESIGN.md 5.24.12): robot photo, local server and external
// services with the links between them, what runs where, and the robot's specifications.
const unit = z.strictObject({
  name: localized,
  sub: localized,
  items: z.array(z.strictObject({ name: localized, value: localized })).min(1),
});
const hardware = (image: ImageFn) =>
  z.strictObject({
    title: localized,
    image: image(),
    alt: localized,
    robot: unit,
    server: unit,
    external: unit,
    links: z.strictObject({ robotServer: z.array(text).length(2), serverExternal: localized }),
    specsTitle: localized,
    specs: z.array(z.strictObject({ label: localized, value: localized })).min(2),
    credit: localized,
  });

const caseStudy = (image: ImageFn) =>
  z.strictObject({
    context: bullets,
    problem: bullets,
    role: bullets,
    approach: bullets,
    outcome: bullets,
    decisions: z
      .array(z.strictObject({ title: localized, rationale: localized, tradeoff: localized }))
      .min(1)
      .max(4)
      .optional(),
    architecture: architecture.optional(),
    // Visitor journey steps under the floor plan (5.24.3): a lead-in note, then numbered steps matching the plan's marks.
    journey: z
      .strictObject({
        note: localized,
        steps: z
          .array(z.strictObject({ title: localized, body: localized, tags: localized }))
          .min(2)
          .max(6),
      })
      .optional(),
    safety: bullets.optional(), // Safety section text under its diagram
    compare: compare(image).optional(),
    roadmap: roadmap.optional(),
    domains: domains.optional(), // under the Approach diagram
    archNote: localized.optional(), // one line under the Architecture diagram (e.g. a target, not current, structure)
    hardware: hardware(image).optional(), // under the Architecture diagram
    loop: bullets.optional(), // Learning loop section text under its figure
    screens: screens(image).optional(), // under the Context bullets
  });

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.strictObject({
      title: localized,
      summary: localized,
      highlights: z.array(localized).min(2).max(3),
      period,
      org: localized.optional(),
      client: client.optional(),
      lead: z.boolean().default(false),
      role: localized.optional(),
      domain: z.enum(DOMAINS),
      capability: z.array(z.enum(CAPABILITIES)).min(1),
      stack: z.array(text),
      featured: z.boolean().default(false),
      order: z.number().optional(),
      caseStudy: caseStudy(image).optional(), // featured projects only; not required (some material is pending)
    }),
});

const personal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/personal' }),
  schema: z
    .strictObject({
      name: localized,
      order: z.number().int().positive(),
      summary: localized.optional(),
      stack: z.array(text).optional(),
      repo: z.url().optional(),
      site: z.url().optional(),
      status: z.enum(['in-progress', 'active', 'archived']).optional(),
    })
    .refine(({ repo, site }) => repo || site, 'Provide a repository or website URL'),
});

const patents = defineCollection({
  loader: data('patents'),
  schema: z.strictObject({
    title: localized, // en: English translation, ko: Korean original
    status: z.enum(['filed', 'registered']),
    number: text.optional(), // omitted on purpose for one registered patent and for filings in progress
    date: dayOrMonth, // filing or registration date
  }),
});

const software = defineCollection({
  loader: data('software'),
  schema: z.strictObject({
    title: localized,
    status: z.enum(['registered', 'pending']),
    number: text.optional(),
    date: dayOrMonth.optional(),
  }),
});

const publications = defineCollection({
  loader: data('publications'),
  schema: z.discriminatedUnion('type', [
    z.strictObject({
      type: z.literal('paper'),
      authors: text,
      title: localized,
      venue: localized,
      year: z.number().int(),
      url: z.url().optional(),
      doi: text.optional(),
    }),
    z.strictObject({
      type: z.literal('report'),
      title: localized,
      publisher: localized.optional(), // some reports list no publisher
      year: z.number().int(),
      featured: z.boolean().default(false),
    }),
  ]),
});

const teaching = defineCollection({
  loader: data('teaching'),
  schema: z.strictObject({
    kind: z.enum(['teaching', 'advisory', 'book']),
    title: localized,
    org: localized,
    years: text, // free text as on the resume, e.g. "2014–2023", "2023, 2024"
    url: z.url().optional(),
    details: z.array(localized).optional(),
  }),
});

const awards = defineCollection({
  loader: data('awards'),
  schema: z.strictObject({ title: localized, org: localized, years: text }),
});

const education = defineCollection({
  loader: data('education'),
  schema: z.strictObject({
    school: localized,
    degree: localized,
    focus: localized.optional(),
    gpa: z
      .string()
      .regex(/^\d\.\d{2} \/ \d\.\d$/, 'Use "3.83 / 4.3"')
      .optional(),
    period,
  }),
});

export const collections = {
  profile,
  experience,
  projects,
  diagrams,
  personal,
  patents,
  software,
  publications,
  teaching,
  awards,
  education,
};
