const topicRouter = require("express").Router();
const { selectTopics } = require("../models/topics.models.js");

topicRouter.route("/").get((req, res) => {
  res.status(200).send("Hey from topic Router!");
});

module.exports = topicRouter;
