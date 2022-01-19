const db = require("../db/connection");

exports.removeComment = async (id) => {
  const query = `DELETE FROM 
                  comments
                WHERE
                  comment_id = $1;`;

  await db.query(query, [id]);
  return;
};
