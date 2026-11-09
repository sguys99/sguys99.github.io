import { defineCollection } from 'astro:content';
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
const DOMAINS = [
  'Energy & Utilities',
  'Manufacturing',
  'Petrochemical & Steel',
  'Healthcare',
  'Robotics',
  'Public & Legal',
] as const;
const CAPABILITIES = [
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

const caseStudy = z.strictObject({
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
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.strictObject({
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
    caseStudy: caseStudy.optional(), // featured projects only; not required (some material is pending)
  }),
});

const personal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/personal' }),
  schema: z.strictObject({
    name: text,
    summary: localized,
    stack: z.array(text),
    repo: z.url(),
    demo: z.url().optional(),
    status: z.enum(['in-progress', 'active', 'archived']),
  }),
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
  schema: z.strictObject({ school: localized, degree: localized, period }),
});

export const collections = {
  profile,
  experience,
  projects,
  personal,
  patents,
  software,
  publications,
  teaching,
  awards,
  education,
};
