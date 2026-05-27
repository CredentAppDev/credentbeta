// Role hierarchy from lowest to highest
const ROLES = ['agent', 'admin'];

/**
 * Middleware factory to restrict access to specific roles
 * @param {...string} roles - Allowed roles
 * @returns {Function} Express middleware
 */
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}`,
      });
    }

    next();
  };
};

// ============================================================================
// EXACT ROLE CHECKS
// ============================================================================

const isOnlyAgent = allowRoles('agent');
const isOnlySeniorAgent = isOnlyAgent;
const isOnlyTeamLead = isOnlyAgent;
const isOnlyAdmin = allowRoles('admin');

// ============================================================================
// HIERARCHY ROLE CHECKS
// ============================================================================

const isAgent = allowRoles(...ROLES.slice(ROLES.indexOf('agent')));
const isAdmin = allowRoles(...ROLES.slice(ROLES.indexOf('admin')));
const isSeniorAgent = isAgent;
const isTeamLead = isAgent;

// ============================================================================
// ALIASES
// ============================================================================

const isAgentOrAbove = isAgent;
const isSeniorOrAbove = isSeniorAgent;
const isTeamLeadOrAbove = isTeamLead;

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  allowRoles,

  isOnlyAgent,
  isOnlySeniorAgent,
  isOnlyTeamLead,
  isOnlyAdmin,

  isAgent,
  isSeniorAgent,
  isTeamLead,
  isAdmin,

  isAgentOrAbove,
  isSeniorOrAbove,
  isTeamLeadOrAbove,
};
