const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.body.user.token;

  if (!token) {
    return res.status(403).send("Token required for validation");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  next();
};
