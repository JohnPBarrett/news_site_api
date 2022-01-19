const userRouter = require("express").Router();
const { getUsers, getUser } = require("../controllers/users.controllers");

userRouter.route("/").get(getUsers);
userRouter.route("/:username").get(getUser);

module.exports = userRouter;
