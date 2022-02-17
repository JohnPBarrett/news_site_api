const loginRouter = require("express").Router();
const {loginUser} = require("../controllers/login.controller")

loginRouter.route("/").post(loginUser)

module.exports = loginRouter