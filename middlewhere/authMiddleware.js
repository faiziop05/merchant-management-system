const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];
    const decodedPayload = jwt.verify(token, process.env.JWT_KEY);
    req.user = decodedPayload;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token. Please log in again." });
  }
};

module.exports = { verifyToken };