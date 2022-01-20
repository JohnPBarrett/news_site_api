const db = require("../db/connection");

exports.selectTopics = async () => {
  const query = "SELECT * FROM topics;";
  const result = await db.query(query);

  return result.rows;
};

exports.insertTopic = async (queryBody) => {
  let query = `INSERT INTO 
                topics(slug, description)
              VALUES 
                ($1, $2)
              RETURNING *;`;

  const validFields = ["slug", "description"];

  for (let key in queryBody) {
    if (!validFields.includes(key)) {
      throw "Invalid field body";
    }
  }

  const result = await db.query(query, [queryBody.slug, queryBody.description]);

  return result.rows[0];
};
