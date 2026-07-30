/**
 * Students reach Emrys through their work, not through a free chat box.
 *
 * The teaching model is that Emrys guides a student on a task their teacher
 * set — an assignment or an exercise — where it can see the instructions, the
 * rubric and the roadmap day, and coach against them. An open-ended chat has
 * none of that context, so it drifts into being a general-purpose AI sitting
 * inside a classroom, which is the thing the syllabus-bound design exists to
 * avoid.
 *
 * This is enforced on the SERVER. Hiding the chat in the desktop app would stop
 * the honest student and nobody else — the endpoints are a plain HTTP call away.
 *
 * What a student can still reach:
 *   POST /api/assignments/:id/help   coaching on a set task (assignmentRoutes)
 *
 * Teachers, agents and admins are unaffected: they use Emrys to prepare and
 * deliver lessons, which is exactly what it is for.
 *
 * Set EMRYS_STUDENT_OPEN_CHAT=true to lift the restriction for a deployment
 * that wants the old behaviour back.
 */
const studentOpenChatAllowed = () =>
  String(process.env.EMRYS_STUDENT_OPEN_CHAT || '').toLowerCase() === 'true';

const blockStudentOpenChat = (req, res, next) => {
  if (!req.user || req.user.role !== 'student') return next();
  if (studentOpenChatAllowed()) return next();

  return res.status(403).json({
    message:
      'Emrys helps you with the work your teacher has set. Open an assignment or exercise and use "Ask Emrys" there — it can see the task and will guide you through it.',
    code: 'EMRYS_ASSIGNMENT_ONLY',
  });
};

module.exports = { blockStudentOpenChat, studentOpenChatAllowed };
