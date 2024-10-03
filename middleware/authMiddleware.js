const jwt = require('jsonwebtoken');

// Middleware to verify JWT token and extract user info
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization'); // Extract the Authorization header

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Check if the token is in the Bearer format
  if (!token.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Token must be in Bearer format' });
  }

  // Extract the actual token by removing "Bearer " prefix
  const actualToken = token.split(' ')[1];

  try {
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET); // Use your secret to verify
    req.user = decoded; // Attach the decoded user info (userId, role) to the request
    next(); // Proceed to the next middleware/route
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = verifyToken;
