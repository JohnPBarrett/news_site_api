const userRouter = require("express").Router();
const { getUsers, getUser, patchUser } = require("../controllers/users.controllers");

userRouter.route("/").get(getUsers);
userRouter.route("/:username").get(getUser).patch(patchUser);

module.exports = userRouter;
