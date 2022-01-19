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

exports.updateComment = async (id, voteInc) => {
  const query = `UPDATE
                  comments
                SET
                  votes = votes + $2
                WHERE
                  comment_id = $1
                RETURNING *;`;

  for (let key in voteInc) {
    if (key !== "inc_votes") {
      throw "Invalid field body";
    }
  }

  const result = await db.query(query, [id, voteInc.inc_votes]);

  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    return Promise.reject({ status: 400, message: "Comment does not exist" });
  }
};
