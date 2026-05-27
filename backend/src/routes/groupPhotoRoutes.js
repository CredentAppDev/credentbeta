/**
 * Group photo + photo-editor permission routes.
 *
 * Mounted at /api/groups in app.js.
 *
 *   POST   /:groupId/profile-picture/upload   ← anyone with permission
 *   GET    /:groupId/photo-editors            ← any authed user
 *   POST   /:groupId/photo-editors            ← agent only (grant)
 *   DELETE /:groupId/photo-editors/:role/:id  ← agent only (revoke)
 *
 * Permissioning for the upload happens INSIDE the controller because the
 * "can edit?" decision depends on data (the group_photo_editors table) not
 * on role alone. The list/grant/revoke endpoints are role-gated here at the
 * route layer for the obvious cases.
 */

const express = require('express');
const { protect } = require('../middleware/auth');
const {
  uploadGroupProfilePicture,
  listGroupPhotoEditors,
  grantGroupPhotoEditor,
  revokeGroupPhotoEditor,
} = require('../controllers/groupPhotoController');

const router = express.Router();

router.use(protect);

// Raw image bytes (same shape as the existing student/teacher profile upload).
router.post(
  '/:groupId/profile-picture/upload',
  express.raw({ type: ['image/jpeg', 'image/png', 'image/webp', 'application/octet-stream'], limit: '6mb' }),
  uploadGroupProfilePicture
);

router.get('/:groupId/photo-editors',                              listGroupPhotoEditors);
router.post('/:groupId/photo-editors',                             grantGroupPhotoEditor);
router.delete('/:groupId/photo-editors/:userRole/:userId',         revokeGroupPhotoEditor);

module.exports = router;
