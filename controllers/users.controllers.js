const {
  selectUsers,
  selectUser,
  updateUser,
  insertUser,
  checkUserExistsRegistration,
} = require("../models/users.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await selectUsers();
    res.status(200).send({ users });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await selectUser(username);

    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.patchUser = async (req, res, next) => {
  try {
    let user;
    const { username } = req.params;

    user = await updateUser(username, req.body);

    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    const { username, name, avatar_url, password } = req.body;

    if (!(username && name && password)) {
      return res.status(400).send("Missing fields");
    }

    // need to check if user already exists

    const existingUser = await checkUserExistsRegistration(username);
    if (existingUser) {
      return res.status(409).send("User already exists");
    }

    encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      name,
      avatar_url,
      password: encryptedPassword,
    };

    await insertUser(newUser);

    const token = jwt.sign(newUser, process.env.TOKEN_KEY);
    newUser.token = token;

    res.status(201).send({ newUser });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
