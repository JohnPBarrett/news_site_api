const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const { username } = req.body;
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (username !== decoded.username) {
      return res.status(403).send("Forbidden");
    }
    req.user = decoded;
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid Token");
  }
  next();
};
