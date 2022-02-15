const userRouter = require("express").Router();
const {
  getUsers,
  getUser,
  patchUser,
  postUser,
} = require("../controllers/users.controllers");

userRouter.route("/").get(getUsers).post(postUser);
userRouter.route("/:username").get(getUser).patch(patchUser);

module.exports = userRouter;
