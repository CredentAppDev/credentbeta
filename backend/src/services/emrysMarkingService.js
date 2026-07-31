/**
 * Emrys marks a submission.
 *
 * Deliberately separate from the tutoring path. A tutor is on the student's
 * side and withholds answers; a marker is assessing finished work and must be
 * candid. Running both through one prompt would have produced a marker that
 * coaches instead of scoring, or a tutor that gives the game away.
 *
 * Two rules shape everything here:
 *
 *  1. The mark is ADVISORY. It is written to ai_score / ai_feedback, never to
 *     the teacher's `grade` column, and is not shown to the student until a
 *     teacher has reviewed it. Emrys proposes; the teacher decides.
 *
 *  2. The model marks against the TEACHER'S rubric where one exists. Without a
 *     rubric it falls back to the instructions, and says so in its reasoning,
 *     so a teacher reading a mark can tell what it was actually judged on.
 */
const fs = require('fs');
const path = require('path');
const { modelName, reasoningParams, textFrom } = require('../config/aiModel');

let _client = null;
const getClient = () => {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  const Anthropic = require('@anthropic-ai/sdk');
  _client = new Anthropic({ apiKey });
  return _client;
};

const MARKER_SYSTEM = `You are Emrys, marking a student's work for their teacher in a Ghanaian school robotics and coding programme. These are beginners, most of them writing their first ever code.

WHAT YOU ARE DOING
You are producing a proposed mark and feedback that the TEACHER will read and decide on. You are not talking to the student. Do not address them as "you".

HOW TO MARK
- Mark against the teacher's rubric. If there is no rubric, mark against the instructions, and say in your reasoning that you did so.
- Judge what the task actually asked for. Do not deduct marks for style, naming, or approaches the task never required.
- Working code that solves the problem in a clumsy way is still working code. Say the approach could be simpler; do not fail it for that.
- If the work is incomplete, mark what is there rather than awarding zero.
- If you cannot tell whether it works (no output, unclear submission), say so plainly and mark conservatively rather than guessing.

TONE OF THE FEEDBACK
The teacher may pass your feedback to the student, so write it so it could be read by a beginner without discouraging them. Name one concrete thing done well and one specific thing to fix next. No praise that is not earned, and no vague criticism.

OUTPUT
Return ONLY minified JSON, no markdown fence:
{"score": <integer 0..MAX>, "summary": "<one sentence for the teacher>", "feedback": "<2-4 sentences a student could read>", "strengths": ["..."], "next_steps": ["..."], "confidence": "high"|"medium"|"low"}

`;

const buildMarkingPrompt = ({ assignment, submission, student }) => {
  const lines = [];
  const kind = assignment.kind === 'exercise' ? 'EXERCISE' : 'ASSIGNMENT';
  lines.push(`${kind}: ${assignment.title}`);
  lines.push(`Maximum score: ${assignment.points || 100}`);
  if (student?.name) lines.push(`Student: ${student.name}`);
  lines.push('');

  lines.push('WHAT THE TEACHER ASKED FOR:');
  lines.push(assignment.instructions || '(no instructions were given)');
  lines.push('');

  if (assignment.rubric) {
    lines.push("THE TEACHER'S RUBRIC — mark against this:");
    lines.push(assignment.rubric);
    lines.push('');
  } else {
    lines.push('No rubric was set. Mark against the instructions above and note that in your reasoning.');
    lines.push('');
  }

  if (assignment.starter_code) {
    lines.push('STARTER CODE the student began from (do not credit them for this part):');
    lines.push(assignment.starter_code);
    lines.push('');
  }

  lines.push("THE STUDENT'S SUBMISSION:");
  lines.push(submission.body ? String(submission.body) : '(nothing was typed)');
  if (submission.link_url) lines.push(`Link submitted: ${submission.link_url}`);
  if (submission.attachment_name) {
    // An image attachment is sent to the model as an actual image alongside
    // this text (see attachmentImageBlock). Anything else — a PDF, a zip — it
    // genuinely cannot open, and it must say so rather than mark blind.
    const isImage = /\.(png|jpe?g|webp|gif)$/i.test(submission.attachment_name);
    if (isImage) {
      lines.push(`The student attached an image (${submission.attachment_name}). It is included above — MARK WHAT YOU CAN SEE IN IT.`);
      lines.push('If it is a photo of code or of a finished build, judge that as their work. If it is unreadable, say so and set confidence to "low".');
    } else {
      lines.push(`A file was attached (${submission.attachment_name}) which you cannot open.`);
      lines.push('If the typed submission alone is not enough to judge, say so and set confidence to "low".');
    }
  }
  if (submission.is_late) lines.push('NOTE: submitted late. Do not deduct for lateness — that is the teacher\'s call.');

  return lines.join('\n');
};

/**
 * The submitted image, as a content block the model can actually look at.
 *
 * Students photograph their screen or their finished build far more often than
 * they paste code — for a robotics class the photo IS the work. Marking that
 * from the filename alone was guessing, so the file is read off disk and sent
 * as a real image block.
 *
 * Returns null for anything that is not an image, for a missing file, or for
 * one too large to send. Every one of those falls back to marking the text,
 * which the prompt already handles.
 */
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;   // comfortably under the API limit
const MIME_BY_EXT = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  webp: 'image/webp', gif: 'image/gif',
};

const attachmentImageBlock = (submission) => {
  const url = submission && submission.attachment_url;
  if (!url || typeof url !== 'string') return null;

  // Only ever a path we issued ourselves. A submission row should not be able
  // to make the server read an arbitrary file off disk.
  if (!url.startsWith('/uploads/')) return null;
  const name = path.basename(url);
  if (name !== url.slice('/uploads/'.length)) return null;   // no traversal

  const ext = (name.split('.').pop() || '').toLowerCase();
  const media_type = MIME_BY_EXT[ext];
  if (!media_type) return null;

  const uploadsRoot = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads');
  const file = path.join(uploadsRoot, name);
  try {
    const stat = fs.statSync(file);
    if (!stat.isFile() || stat.size === 0 || stat.size > MAX_IMAGE_BYTES) return null;
    return {
      type: 'image',
      source: { type: 'base64', media_type, data: fs.readFileSync(file).toString('base64') },
    };
  } catch (_) {
    return null;   // gone or unreadable — mark the text instead
  }
};

/** Tolerant JSON parse — strips a fence, takes the first balanced object. */
const parseMark = (raw, maxScore) => {
  if (!raw) return null;
  let text = String(raw).replace(/```(?:json)?\s*([\s\S]*?)```/i, '$1').trim();
  const s = text.indexOf('{');
  const e = text.lastIndexOf('}');
  if (s === -1 || e <= s) return null;
  let obj = null;
  const slice = text.slice(s, e + 1);
  try { obj = JSON.parse(slice); }
  catch { try { obj = JSON.parse(slice.replace(/,\s*([}\]])/g, '$1')); } catch { return null; } }
  if (!obj || typeof obj !== 'object') return null;

  // Clamp rather than reject. A model returning 105/100 is still a useful mark;
  // storing it would violate the grade constraint and lose the feedback with it.
  let score = Number(obj.score);
  if (!Number.isFinite(score)) return null;
  score = Math.max(0, Math.min(Math.round(score), maxScore));

  return {
    score,
    summary: String(obj.summary || '').trim(),
    feedback: String(obj.feedback || '').trim(),
    strengths: Array.isArray(obj.strengths) ? obj.strengths.map(String).slice(0, 5) : [],
    next_steps: Array.isArray(obj.next_steps) ? obj.next_steps.map(String).slice(0, 5) : [],
    confidence: ['high', 'medium', 'low'].includes(obj.confidence) ? obj.confidence : 'medium',
  };
};

/**
 * Mark one submission. Resolves to null when the model is unavailable or its
 * reply could not be parsed — callers treat null as "not marked" and leave the
 * submission for the teacher, which is the correct failure mode.
 */
const markSubmission = async ({ assignment, submission, student }) => {
  const client = getClient();
  if (!client) return null;

  const maxScore = Number.isFinite(Number(assignment.points)) ? Number(assignment.points) : 100;
  const system = MARKER_SYSTEM.replace('0..MAX', `0..${maxScore}`);
  const prompt = buildMarkingPrompt({ assignment, submission, student });

  // Image first, then the brief. The model reads the picture as the work and
  // the text as the instructions about it — the other order makes the image
  // read like an afterthought appended to a question already asked.
  const image = attachmentImageBlock(submission);
  const content = image ? [image, { type: 'text', text: prompt }] : prompt;
  if (image) console.log(`[emrysMarking] marking submission ${submission.id} WITH its image attachment`);

  try {
    const message = await client.messages.create({
      model: modelName(),
      max_tokens: 8000,
      // Marking is a judgement call against a rubric, so it gets real thinking.
      ...reasoningParams(8000, 'high'),
      system,
      messages: [{ role: 'user', content }],
    });
    const parsed = parseMark(textFrom(message), maxScore);
    if (!parsed) {
      console.warn('[emrysMarking] could not parse a mark for submission', submission.id);
      return null;
    }
    return parsed;
  } catch (err) {
    console.error('[emrysMarking] marking failed:', err.message);
    return null;
  }
};

/** The stored feedback string a teacher (and later the student) reads. */
const formatFeedback = (mark) => {
  if (!mark) return '';
  const parts = [mark.feedback];
  if (mark.strengths.length) parts.push(`\n\nWhat went well:\n${mark.strengths.map(s => `• ${s}`).join('\n')}`);
  if (mark.next_steps.length) parts.push(`\n\nWhat to work on next:\n${mark.next_steps.map(s => `• ${s}`).join('\n')}`);
  if (mark.confidence === 'low') {
    parts.push('\n\n(Emrys was not confident about this one — worth a closer look.)');
  }
  return parts.join('').trim();
};

module.exports = {
  markSubmission, formatFeedback, parseMark, buildMarkingPrompt,
  // Exported for testing: its path handling is the only place a submission row
  // can influence which file the server reads, so it needs to be exercisable.
  attachmentImageBlock,
};
