const apiRouter = require("express").Router();
const topicRouter = require("./topicRouter");
const articleRouter = require("./articleRouter");
const commentRouter = require("./commentRouter");
const userRouter = require("./userRouter");
const loginRouter = require("./loginRouter");
const { apiController } = require("../controllers/api.controller");

apiRouter.route("/").get(apiController);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/login", loginRouter);

module.exports = apiRouter;
