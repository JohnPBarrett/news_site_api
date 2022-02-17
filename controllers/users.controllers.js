const {
  selectUsers,
  selectUser,
  updateUser,
  insertUser,
} = require("../models/users.models");

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

exports.postUser = async (req, res, next) => {
  try {
    user = await insertUser(req.body);

    res.status(201).send({ user });
  } catch (err) {
    next(err);
  }
};
