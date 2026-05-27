const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const UPLOAD_ROOT = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads');
const AUDIO_UPLOAD_DIR = path.join(UPLOAD_ROOT, 'audio');

const parseDuration = (value) => {
  const parsed = parseInt(value, 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
};

const saveRawAudioUpload = async (req, prefix = 'voice-message') => {
  const buffer = Buffer.isBuffer(req.body) ? req.body : null;
  if (!buffer || buffer.length === 0) {
    const error = new Error('Audio file is required');
    error.statusCode = 400;
    throw error;
  }

  await fs.promises.mkdir(AUDIO_UPLOAD_DIR, { recursive: true });

  const filename = `${prefix}-${Date.now()}-${crypto.randomUUID()}.m4a`;
  const filePath = path.join(AUDIO_UPLOAD_DIR, filename);
  await fs.promises.writeFile(filePath, buffer);

  return {
    mediaUrl: `/uploads/audio/${filename}`,
    audioDuration: parseDuration(req.get('x-audio-duration')),
    byteLength: buffer.length,
  };
};

module.exports = {
  saveRawAudioUpload,
};
