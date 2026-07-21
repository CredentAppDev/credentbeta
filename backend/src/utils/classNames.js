// ─── Class-name canonicalisation ─────────────────────────────────────────────
//
// Class names were free text with no normalisation anywhere, so the same class
// arrived spelled several ways — production has a group classed "JHS3" whose
// members are classed "JHS 3". Because the agent's class picker is built from
// `SELECT DISTINCT class_name FROM students`, every variant showed up as its
// OWN class, and groups got permanently split across them. It also hid a
// student's own group from them on the leaderboard.
//
// Everything that writes a class name now runs it through canonicalClassName()
// so one class has exactly one stored spelling.
//
//   "JHS 3" | "JHS3" | "jhs-3" | "jHs  3"  ->  "JHS 3"
//   "class4" | "CLASS 4" | " Class  4 "    ->  "Class 4"
//
// classKey() is the loose comparison key (letters+digits only) used to decide
// whether two spellings mean the same class — keep it in step with the
// REGEXP_REPLACE(LOWER(x), '[^a-z0-9]', '', 'g') used in analyticsController.

// Tokens with a fixed house style. Anything else is Title Cased.
const TOKEN_FORMS = new Map([
  ['JHS', 'JHS'], ['SHS', 'SHS'], ['JSS', 'JSS'], ['SSS', 'SSS'],
  ['KG', 'KG'], ['PRE-K', 'Pre-K'], ['PREK', 'Pre-K'],
  ['NURSERY', 'Nursery'], ['CRECHE', 'Creche'], ['RECEPTION', 'Reception'],
  ['BASIC', 'Basic'], ['CLASS', 'Class'], ['GRADE', 'Grade'], ['YEAR', 'Year'],
  ['FORM', 'Form'], ['PRIMARY', 'Primary'],
]);

/**
 * Canonical stored form of a class name. Returns null for empty input so
 * callers can keep using `|| null`.
 */
const canonicalClassName = (raw) => {
  if (raw === null || raw === undefined) return null;
  let s = String(raw).trim();
  if (!s) return null;

  s = s.replace(/[_]+/g, ' ');
  // "pre k" / "pre-k" / "prek" -> a single token we can style below
  s = s.replace(/\bpre\s*-?\s*k\b/gi, 'PRE-K');
  // Split letter/digit runs that were jammed together: JHS3 -> JHS 3, 3B -> 3 B
  s = s.replace(/([A-Za-z])(\d)/g, '$1 $2');
  s = s.replace(/(\d)([A-Za-z])/g, '$1 $2');
  // A hyphen sitting between a word and a number is a separator, not a joiner.
  // (Pre-K keeps its hyphen because K is not a digit.)
  s = s.replace(/([A-Za-z])\s*-\s*(\d)/g, '$1 $2');
  s = s.replace(/\s+/g, ' ').trim();
  if (!s) return null;

  return s
    .split(' ')
    .map((word) => {
      const up = word.toUpperCase();
      if (TOKEN_FORMS.has(up)) return TOKEN_FORMS.get(up);
      if (/^\d+$/.test(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

/**
 * Loose key for "are these the same class?" — letters and digits only.
 * "JHS 3", "JHS3" and "jhs-3" all key to "jhs3".
 */
const classKey = (raw) => String(raw ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

/** True when two spellings refer to the same class. */
const sameClass = (a, b) => {
  const ka = classKey(a);
  const kb = classKey(b);
  return ka !== '' && ka === kb;
};

module.exports = { canonicalClassName, classKey, sameClass };
