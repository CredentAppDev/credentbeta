/**
 * Test the new teachGenerateSectionContent prompt against a real empty
 * section in a real project. Prints the full Claude response + word count
 * so we can confirm the prompt produces actual teaching content (not just
 * a guideline template).
 *
 * Usage:
 *   node scripts/testLessonGeneration.js [projectId] [sectionNum]
 *
 * Defaults: projectId=1 (Voice Assistant), sectionNum=12 (AI safety reflection)
 * Both are configured to be a section with 0 chunks so the AI fallback fires.
 *
 * Requires ANTHROPIC_API_KEY in backend/.env.
 */

require('dotenv').config();
const pool = require('../src/config/db');
const Anthropic = require('@anthropic-ai/sdk');
const { SYSTEM_PROMPTS } = require('../src/services/controlledAiTutorService');

const PROJECT_ID = Number(process.argv[2] || 1);
const SECTION_NUM = Number(process.argv[3] || 12);

async function main() {
  const proj = (await pool.query('SELECT * FROM learning_projects WHERE id=$1', [PROJECT_ID])).rows[0];
  if (!proj) throw new Error(`No project with id=${PROJECT_ID}`);
  const days = (await pool.query(
    'SELECT * FROM learning_project_roadmap_days WHERE project_id=$1 AND is_active=true ORDER BY COALESCE(section_number, day_number)',
    [PROJECT_ID]
  )).rows;
  const chunks = (await pool.query(
    'SELECT * FROM learning_content_chunks WHERE project_id=$1 AND is_active=true',
    [PROJECT_ID]
  )).rows;

  const day = days.find(d => (d.section_number || d.day_number) === SECTION_NUM);
  if (!day) throw new Error(`No section ${SECTION_NUM} in project ${PROJECT_ID}`);
  const idx = days.findIndex(d => (d.section_number || d.day_number) === SECTION_NUM);
  const prevDay = idx > 0 ? days[idx - 1] : null;
  const nextDay = idx >= 0 && idx < days.length - 1 ? days[idx + 1] : null;
  const sectionChunks = chunks.filter(c => Number(c.step_number) === SECTION_NUM);
  const projectWideChunks = chunks.filter(c => !c.step_number);

  console.log('═══ TEST INPUTS ═══');
  console.log(`Project: ${proj.title} (${proj.class_name})`);
  console.log(`Section ${SECTION_NUM}: ${day.title}`);
  console.log(`Section chunks: ${sectionChunks.length}  Project-wide chunks: ${projectWideChunks.length}`);
  console.log(`Prev: ${prevDay ? prevDay.title : '(none)'}`);
  console.log(`Next: ${nextDay ? nextDay.title : '(none)'}`);
  console.log('');

  // ── Build the prompt exactly like teachGenerateSectionContent does ─────
  const className = proj.class_name || proj.grade || '';
  const acts = Array.isArray(day.activities) ? day.activities.join('; ') : '';
  const mats = Array.isArray(day.materials)  ? day.materials.join('; ')  : '';
  const codeFocus = day.code_explanation_focus || '';
  const renderChunk = (c) => `[${c.title || 'Untitled'}] ${(c.content || '').slice(0, 800)}`;
  const lines = [];
  if (proj.description) lines.push(`Description: ${proj.description}`);
  if (proj.learning_goals) lines.push(`Learning goals: ${proj.learning_goals}`);
  if (projectWideChunks.length) {
    lines.push('', '=== Project-wide reference (always relevant) ===');
    projectWideChunks.forEach(c => lines.push(renderChunk(c)));
  }
  if (sectionChunks.length) {
    lines.push('', '=== Approved chunks tagged to THIS section ===');
    sectionChunks.forEach(c => lines.push(renderChunk(c)));
  }
  if (prevDay) lines.push('', `Previous section (${prevDay.section_number || prevDay.day_number}): "${prevDay.title || ''}" — students already learned: ${prevDay.student_goal || '—'}`);
  if (nextDay) lines.push(`Next section (${nextDay.section_number || nextDay.day_number}): "${nextDay.title || ''}" — students will learn next: ${nextDay.student_goal || '—'}`);
  const projectContext = lines.join('\n');

  const cls = String(className || '').trim();
  const isEarlyYears = /(kinder|recept|nurser|pre[-\s]?k|kg|pre[-\s]?primary|cr[eè]che|playgroup|toddler)/i.test(cls);
  const classNum = parseInt(cls.match(/\d+/)?.[0] || '0', 10);
  const register = isEarlyYears
    ? 'EARLY YEARS (Kindergarten / Pre-K / Reception, ages 3-5): one tiny idea per sentence, max 8 words, lots of "look", "touch", "try", use bright pictures and physical movement, never abstract, never code on screen — act everything out with objects.'
    : (classNum > 0 && classNum <= 4)
      ? 'PRIMARY (Class 1–4): one short idea per sentence, max 12 words per sentence, lots of "look at this" and "try this", no abstract reasoning, draw or act out new ideas.'
      : classNum >= 9
        ? 'UPPER (Class 9+): plain language but real terminology is okay if defined the first time, sentences can chain ideas, students can handle short abstract reasoning.'
        : 'MIDDLE (Class 5–8): plain everyday language, one idea at a time, anchor every new term to something they already know, short paragraphs.';

  const prompt = `You are Emrys, an expert teacher writing the ACTUAL TEACHING CONTENT for a single 60-minute lesson. This content will be projected as the lesson itself — the teacher will read directly from it. It is NOT a lesson plan, NOT a guideline, NOT a template to fill in. It IS the textbook chapter the class will work through together.

═══ THE PROJECT (the ONLY source you may draw from for specifics) ═══

Project: ${proj.title}
Class: ${className || 'mixed'} — register: ${register}
${projectContext || '(no extra project context provided)'}

═══ THIS SECTION ═══

Section ${SECTION_NUM}: "${day.title || day.section_label || ''}"
Teacher goal (private — do not surface, just use as orientation): ${day.teacher_goal || '—'}
Student outcome (what they should be able to do by the end): ${day.student_goal || '—'}
Materials available: ${mats || '—'}
${codeFocus ? `Code/step focus: ${codeFocus}\n` : ''}
═══ DEPTH REQUIREMENTS — THE WHOLE POINT OF THIS PROMPT ═══

A guideline says "explain variables." Teaching content explains them — what they ARE, what they DO, what they LOOK LIKE in code, why they matter, with multiple examples and a line-by-line walkthrough of working code. Your output MUST do the second thing, not the first.

For EVERY new concept introduced:
1. Define it precisely (the real meaning, not just an analogy).
2. THEN give a relatable metaphor or comparison.
3. Show what it LOOKS LIKE — in code, on the hardware, on screen.
4. Explain WHY it works the way it does.
5. Show at least one concrete example with real values/names from this project.

For EVERY code block:
- Include the COMPLETE code, not a fragment.
- After the block, walk through it LINE BY LINE.
- For any function call, name its arguments and explain each one.
- Mention the expected behaviour.

For EVERY exercise:
- Specify the EXACT change to make.
- State the EXPECTED result.
- Give 3-tier hint ladder.
- Include at least one failure mode and recovery.

═══ THE STRUCTURE ═══

## 📖 What we'll learn today
4–6 sentences naming specific concepts, specific code, what they'll build.

## 🌟 Why this matters
1–2 paragraphs grounding this in something real. End with a guess-question + the actual answer.

## 🧠 The big idea — explained properly

4–8 paragraphs of REAL EXPLANATION. Plain-English + precise technical definition. How it works. 2–3 examples with real values from this project. Define every new term inline with precise meaning AND metaphor.

## 👀 Worked example

Show COMPLETE working code in a fenced block. Walk through it LINE BY LINE with a bullet per line explaining what it does and why.

## ✋ Hands-on practice

Exact instructions + expected outcome + predict-step + 3-tier hints + failure mode + recovery.

## 🔄 Connect it back

2–3 sentences linking back to the big idea, reusing defined vocabulary.

## 💭 Check for understanding

5 questions with **bold answers**: 2 recall, 2 application, 1 transfer.

## ➡️ Coming up next
2–3 sentences linking to the next section.

═══ HARD RULES ═══

- WRITE TEACHING CONTENT, NOT A TEMPLATE. Big-idea + walkthrough: at least 600–900 words.
- ZERO assumed background.
- Be specific to THIS project — every component from project context. No invented hardware.
- Code blocks fenced with \`\`\` and a language tag.
- Do NOT include section headers like "Activities" / "Materials".
- Do NOT start with the section number or title.
- Never write "the teacher demonstrates" — write the demonstration itself.`;

  console.log(`═══ PROMPT (${prompt.length} chars) ═══`);
  // (full prompt is huge; omit by default — uncomment to inspect)
  // console.log(prompt);
  // console.log('');

  // ── Call Claude ────────────────────────────────────────────────────────
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY missing in .env');
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const t0 = Date.now();
  const resp = await anthropic.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929',
    max_tokens: 4096,
    system: SYSTEM_PROMPTS.teacher,
    messages: [{ role: 'user', content: prompt }],
  });
  const dur = ((Date.now() - t0) / 1000).toFixed(1);
  const answer = resp.content[0]?.type === 'text' ? resp.content[0].text : '';

  console.log(`═══ GENERATED LESSON (${resp.usage?.output_tokens} tokens, ${dur}s) ═══\n`);
  console.log(answer);
  console.log('\n═══ STATS ═══');
  const wc = answer.split(/\s+/).filter(Boolean).length;
  const codeBlocks = (answer.match(/```/g) || []).length / 2;
  const headings = (answer.match(/^##? /gm) || []).length;
  console.log(`Word count: ${wc} (target: 1500–2500)`);
  console.log(`Code blocks: ${codeBlocks}`);
  console.log(`Section headings: ${headings}`);
  console.log(`Bold answers (for check-for-understanding): ${(answer.match(/\*\*[^*]+\*\*/g) || []).length}`);
}

main()
  .then(() => pool.end())
  .catch((e) => {
    console.error('TEST FAILED:', e.message);
    // Print every layer of error info — APIConnectionError wraps the
    // underlying fetch/undici failure as `.cause`, and that's where the
    // real reason lives (proxy, DNS, TLS, etc.).
    if (e.cause) {
      console.error('CAUSE:', e.cause?.message || e.cause);
      if (e.cause?.code) console.error('CODE:', e.cause.code);
    }
    if (e.status) console.error('HTTP STATUS:', e.status);
    if (e.error)  console.error('API ERROR:', JSON.stringify(e.error));
    if (process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.https_proxy || process.env.http_proxy) {
      console.error('PROXY ENV (probably the culprit):',
        'HTTPS_PROXY=' + (process.env.HTTPS_PROXY || process.env.https_proxy || ''),
        'HTTP_PROXY=' + (process.env.HTTP_PROXY || process.env.http_proxy || ''));
    }
    pool.end();
    process.exit(1);
  });
