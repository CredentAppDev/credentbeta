const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const UPLOAD_ROOT = process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'uploads');
const MEDIA_UPLOAD_DIR = path.join(UPLOAD_ROOT, 'media');

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'video/x-msvideo': 'avi',
  'video/webm': 'webm',
  'application/pdf': 'pdf',
};

const saveRawMediaUpload = async (req, prefix = 'media') => {
  const buffer = Buffer.isBuffer(req.body) ? req.body : null;
  if (!buffer || buffer.length === 0) {
    const error = new Error('File is required');
    error.statusCode = 400;
    throw error;
  }

  const contentType = (req.get('Content-Type') || 'application/octet-stream').split(';')[0].trim();
  const ext = MIME_TO_EXT[contentType] || 'bin';

  await fs.promises.mkdir(MEDIA_UPLOAD_DIR, { recursive: true });

  const filename = `${prefix}-${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const filePath = path.join(MEDIA_UPLOAD_DIR, filename);
  await fs.promises.writeFile(filePath, buffer);

  let messageType = 'file';
  if (contentType.startsWith('image/')) messageType = 'image';
  else if (contentType.startsWith('video/')) messageType = 'video';

  return {
    mediaUrl: `/uploads/media/${filename}`,
    messageType,
  };
};

module.exports = { saveRawMediaUpload };
