const userRouter = require("express").Router();
const {
  getUsers,
  getUser,
  patchUser,
  registerUser,
} = require("../controllers/users.controllers");

userRouter.route("/").get(getUsers).post(registerUser);
userRouter.route("/:username").get(getUser).patch(patchUser);

module.exports = userRouter;
