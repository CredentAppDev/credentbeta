const { createAuditLog } = require('../models/auditModel');

const audit = (action, targetType) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = async (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          let targetId = null;

          if (req.params?.id) {
            const parsed = parseInt(req.params.id, 10);
            targetId = Number.isNaN(parsed) ? null : parsed;
          } else if (req.user?.role === 'student' || req.user?.role === 'teacher') {
            // useful for self profile actions like /student/profile-picture
            targetId = req.user.id || null;
          }

          await createAuditLog({
            actor_id: req.user?.id || null,
            actor_name: req.user?.full_name || req.user?.fullName || null,
            actor_role: req.user?.role || null,
            action,
            target_type: targetType,
            target_id: targetId,
            metadata: {
              method: req.method,
              path: req.path,
              body: req.body || {},
            },
            ip_address: req.ip,
          });
        } catch (error) {
          console.error('Audit log error:', error.message);
        }
      }

      return originalJson(body);
    };

    next();
  };
};

module.exports = { audit };