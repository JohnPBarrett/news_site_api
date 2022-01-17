const db = require("../db/connection");

exports.selectTopics = () => {
  try {
    const query = "SELECT * FROM topics;";
    return db.query(query);
  } catch (err) {
    return Promise.reject({ message: err, status: 400 });
  }
};
