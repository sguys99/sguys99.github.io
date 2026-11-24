// Read the text a static page supplies to the browser, including template contents and print styles.
import { parse as parseHtml } from 'parse5';
import * as css from 'css-tree';

export function distCopy(files, read, check) {
  const declarations = [];
  const variables = new Map();
  const attributes = new Map();

  function stylesheet(source, location, context = 'stylesheet') {
    const tree = css.parse(source, { context, parseCustomProperty: true });
    css.walk(tree, {
      visit: 'Declaration',
      enter(node) {
        const name = css.ident.decode(node.property);
        const entry = { value: node.value, location };
        if (name.toLowerCase() === 'content') declarations.push(entry);
        if (name.startsWith('--')) {
          if (!variables.has(name)) variables.set(name, []);
          variables.get(name).push(entry);
        }
      },
    });
  }

  function html(node, file) {
    const tag = node.tagName;
    const attr = (key) => node.attrs?.find((a) => a.name === key)?.value;
    const place = tag ? `${file} <${tag}>` : file;
    if (tag === 'style') {
      stylesheet(node.childNodes.map((n) => n.value).join(''), place);
      return;
    }
    if (tag === 'script') {
      if (attr('type') === 'application/ld+json') {
        JSON.parse(node.childNodes.map((n) => n.value).join(''), (_, v) => {
          if (typeof v === 'string') check(v, place);
          return v;
        });
      }
      return;
    }
    if (node.nodeName === '#text') check(node.value, file, 'html-text');
    for (const { name, value } of node.attrs ?? []) {
      if (name === 'style') stylesheet(value, place, 'declarationList');
      else if (
        [
          'alt',
          'title',
          'placeholder',
          'label',
          'aria-label',
          'aria-description',
          'aria-valuetext',
          'aria-roledescription',
          'aria-placeholder',
          'aria-braillelabel',
          'aria-brailleroledescription',
          // Buttons and filters replace their text or live region with these labels.
          'data-more',
          'data-less',
          'data-label',
          'data-showing',
          'data-copied',
          'data-msg',
        ].includes(name) ||
        (tag === 'meta' && name === 'content') ||
        (tag === 'input' && name === 'value')
      )
        check(value, `${place} ${name}`);
      // Generated content can refer to any HTML attribute via attr(), even a data-* field.
      if (/[—·]/.test(value)) {
        if (!attributes.has(name)) attributes.set(name, []);
        attributes.get(name).push({ value, location: `${place} ${name}` });
      }
    }
    for (const child of (node.content ?? node).childNodes ?? []) html(child, file);
  }

  for (const file of files) {
    if (file.endsWith('.css')) stylesheet(read(file), file);
    else html(parseHtml(read(file)), file);
  }
  // Follow var() across stylesheets, including fallbacks and cycles, but only from a content declaration.
  const seen = new Set();
  for (const entry of declarations) {
    if (seen.has(entry)) continue;
    seen.add(entry);
    css.walk(entry.value, (node) => {
      if (node.type === 'String') check(node.value, `${entry.location} CSS content`);
      if (node.type !== 'Function') return;
      const first = node.children.first;
      if (first?.type !== 'Identifier') return;
      const name = css.ident.decode(first.name);
      const fn = css.ident.decode(node.name).toLowerCase();
      if (fn === 'var') declarations.push(...(variables.get(name) ?? []));
      if (fn === 'attr')
        for (const attr of attributes.get(name) ?? []) check(attr.value, attr.location);
    });
  }
}
