// Middleware to enforce role-based access control
const permit = (...allowedRoles) => {
    return (req, res, next) => {
      const { role } = req.user;
  
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({ msg: 'Access denied' });
      }
  
      next();
    };
  };
  
  module.exports = permit;
  