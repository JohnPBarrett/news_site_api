const db = require("../db/connection");

exports.selectUsers = async () => {
  const query = `SELECT
                username
              FROM
                users;`;

  const result = await db.query(query);
  return result.rows;
};
