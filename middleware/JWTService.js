const jwt = require("jsonwebtoken");

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = await jwt.verifySync(token, process.env.JWT_SECRET);
    req.id = user.id;
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
