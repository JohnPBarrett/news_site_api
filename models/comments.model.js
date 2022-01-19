const db = require("../db/connection");

exports.removeComment = async (id) => {
  const query = `DELETE FROM 
                  comments
                WHERE
                  comment_id = $1
                RETURNING *;`;

  const result = await db.query(query, [id]);
  if (result.rows.length === 0) {
    return Promise.reject({ status: 400, message: "Comment does not exist" });
  } else {
    return;
  }
};
