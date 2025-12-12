// Verify JWT token middleware
// Reads token from req.headers.authorization (raw token string)
// On success attaches decoded payload to req.user

const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded contains whatever we signed (we use { id, name })
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
