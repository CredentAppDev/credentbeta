const jwt = require('jsonwebtoken');
const { findUserById } = require('../models/userModel');
const {
  findStudentByDbId,
  findTeacherByDbId,
} = require('../models/schoolModel');

const STAFF_ROLES = ['agent', 'admin'];

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({ message: 'Not authorized, invalid token payload' });
    }

    let user = null;

    if (STAFF_ROLES.includes(decoded.role)) {
      user = await findUserById(decoded.id);
      if (user) {
        user.role = user.role || decoded.role;
      }
    } else if (decoded.role === 'student') {
      user = await findStudentByDbId(decoded.id);
      if (user) {
        user.role = 'student';
      }
    } else if (decoded.role === 'teacher') {
      user = await findTeacherByDbId(decoded.id);
      if (user) {
        user.role = 'teacher';
      }
    } else {
      return res.status(401).json({ message: 'Not authorized, invalid role' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    // Normalize display name for audit / controllers
    if (!user.full_name && user.fullName) {
      user.full_name = user.fullName;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
