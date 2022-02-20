const jwt = require("jsonwebtoken");
const { checkUserExists } = require("../models/users.models");
const bcrypt = require("bcrypt");

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
      const token = jwt.sign(
        { username: user.username },
        process.env.TOKEN_KEY,
        { expiresIn: "600s" }
      );

      user = {
        username: user.username,
        token,
      };

      res.status(200).send({ user });
    } else {
      res.status(400).send("Invalid credentials");
    }
  } catch (err) {
    next(err);
  }
};
