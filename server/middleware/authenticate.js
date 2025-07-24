const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  jwt.verify(token.split(" ")[1], keys.secretOrKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = decoded; // Attach user info to the request
    next();
  });
};

module.exports = authenticate;
