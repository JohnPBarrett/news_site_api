const userRouter = require("express").Router();
const {
  getUsers,
  getUser,
  patchUser,
  registerUser
} = require("../controllers/users.controllers");
const { verifyToken } = require("../middleware/auth");

userRouter.route("/").get(getUsers).post(registerUser);
userRouter.route("/:username").get(getUser).patch(verifyToken, patchUser);

module.exports = userRouter;
