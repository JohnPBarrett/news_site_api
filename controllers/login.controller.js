const jwt = require("jsonwebtoken");
const { selectUser } = require("../models/users.models");

exports.loginUser = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await selectUser(username);

    if (!user) {
      return res.status(401).send("User not found");
    }
    const token = jwt.sign({ user }, process.env.TOKEN_KEY);

    user.token = token;

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};
