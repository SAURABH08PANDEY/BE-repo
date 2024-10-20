const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header missing", status: false });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing", status: false });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Invalid or expired token", status: false });
      }
      req.auth_user = user;
      next();
    });
  } catch (error) {
    res
      .status(403)
      .json({ status: false, message: "Invalid or expired token" });
    return;
  }
};

module.exports = {
  authMiddleware,
};
