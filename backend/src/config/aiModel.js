/**
 * One source of truth for which Claude model the platform talks to, and how to
 * ask it to reason.
 *
 * The model name used to be the literal 'claude-sonnet-4-6' copy-pasted into
 * four files. A model change meant finding all four, and missing one left a
 * route quietly running a different model from the rest of the product.
 *
 * Override for a single deploy with the ANTHROPIC_MODEL env var.
 */
const DEFAULT_MODEL = 'claude-sonnet-4-5-20250929';

const modelName = () => process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

/**
 * Does this model speak the Claude 5 reasoning dialect?
 *
 * Verified against the live API, because the two generations are mutually
 * incompatible and both failures are a hard 400:
 *
 *   Claude 5   → output_config:{effort}, thinking:{type:'adaptive'}
 *   Claude 4.x → thinking:{type:'enabled',budget_tokens:N}
 *                "This model does not support the effort parameter."
 *                "adaptive thinking is not supported on this model"
 *
 * Matches claude-opus-5 / claude-sonnet-5 (with or without a date suffix) but
 * NOT claude-sonnet-4-5-20250929, where the 5 is the minor version.
 */
const isGen5 = (model) => /^claude-[a-z]+-5(-\d{8})?$/.test(String(model || ''));

// Thinking budgets for the Claude 4.x dialect, which wants an explicit token
// count rather than an effort label.
const BUDGET_FOR = { low: 0, medium: 4000, high: 10000, xhigh: 16000, max: 24000 };

/**
 * Reasoning parameters for the configured model, in its own dialect.
 * Spread into a messages.create()/stream() request.
 *
 * `effort` is the intent ('low' | 'medium' | 'high' | 'xhigh' | 'max');
 * `think: false` turns reasoning off outright for trivial calls.
 */
const reasoningParams = (maxTokens, effort = 'medium', think = true) => {
  const model = modelName();

  if (isGen5(model)) {
    // Thinking may only be switched off at effort 'high' or below, so a caller
    // asking for no thinking at 'xhigh'/'max' gets its effort capped rather
    // than a 400 it did not ask for.
    const capped = !think && (effort === 'xhigh' || effort === 'max') ? 'high' : effort;
    return {
      output_config: { effort: capped },
      thinking: think ? { type: 'adaptive' } : { type: 'disabled' },
    };
  }

  if (!think) return { thinking: { type: 'disabled' } };

  // budget_tokens must be >= 1024 and strictly less than max_tokens, leaving
  // room for the reply itself — otherwise the request 400s or the answer has
  // nowhere to go.
  const wanted = BUDGET_FOR[effort] ?? BUDGET_FOR.medium;
  const budget = Math.min(wanted, Math.floor(maxTokens * 0.6));
  if (budget < 1024) return { thinking: { type: 'disabled' } };
  return { thinking: { type: 'enabled', budget_tokens: budget } };
};

/**
 * The assistant's text, wherever it sits in the response.
 *
 * A response can contain thinking blocks before the text, so indexing
 * content[0] is not safe — it returns a thinking block, fails a `type ===
 * 'text'` check, and the caller sees nothing with no error raised. Both
 * generations do this when thinking is on. Always select text blocks by type.
 */
const textFrom = (response) =>
  (response?.content || [])
    .filter((b) => b && b.type === 'text' && b.text)
    .map((b) => b.text)
    .join('\n')
    .trim();

module.exports = { DEFAULT_MODEL, modelName, isGen5, reasoningParams, textFrom };
