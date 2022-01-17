const { selectTopics } = require("../models/topics.models.js");

exports.getTopics = (req, res, next) => {
  try {
    selectTopics().then(({ rows }) => {
      res.status(200).send({ topics: rows });
    });
  } catch (err) {
    next(err);
  }
};
