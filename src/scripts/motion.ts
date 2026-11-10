// Entrance motion (cards and rows, trajectory draw, count-up) plays on the session's first visit only
// (DESIGN.md 3장 Motion "세션 재생"). Reduced motion always wins. Storage errors mean "play".
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let played = false;
try {
  played = sessionStorage.getItem('motion-played') === '1';
  if (!reduced) sessionStorage.setItem('motion-played', '1');
} catch {}

export const playMotion = !reduced && !played;
