const { checkUserExists } = require("../models/users.models");
const bcrypt = require("bcrypt");
const generateAccessToken = require("../utils/generateAccessToken");

exports.loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!(username, password)) {
      return res.status(400).send("Missing fields");
    }

    let user = await checkUserExists(username);

    if (!user) {
      return res.status(401).send("User not found");
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateAccessToken(user);

      user = {
        username: user.username,
        token
      };

      res.status(200).send({ user });
    } else {
      res.status(400).send("Invalid credentials");
    }
  } catch (err) {
    next(err);
  }
};
