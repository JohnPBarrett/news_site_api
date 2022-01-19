const apiRouter = require("express").Router();
const topicRouter = require("./topicRouter");
const articleRouter = require("./articleRouter");
const commentRouter = require("./commentRouter");
const { apiController } = require("../controllers/api.controller");

apiRouter.route("/").get(apiController);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);

module.exports = apiRouter;
