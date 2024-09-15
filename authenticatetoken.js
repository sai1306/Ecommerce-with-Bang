const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Get the bearer token from the authorization header
  const isToken = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  const token = req.headers['authorization'].split(' ')[1];
  if (!isToken) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  try {
    // Verify the bearer token with the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user data (id, role) to the request object
    next(); // Continue to the route handler
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateToken;
