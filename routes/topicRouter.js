const topicRouter = require("express").Router();
const { selectTopics } = require("../models/topics.models.js");

topicRouter.route("/").get((req, res) => {
  try {
    selectTopics().then(({ rows }) => {
      res.status(200).send({ topics: rows });
    });
  } catch (err) {
    return Promise.reject({ message: err, status: 400 });
  }
});

module.exports = topicRouter;
