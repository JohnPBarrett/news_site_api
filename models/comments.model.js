const db = require("../db/connection");
const { checkExists } = require("../utils/checkExists");

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

exports.updateCommentVotes = async (id, voteInc) => {
  const query = `UPDATE
                  comments
                SET
                  votes = votes + $2
                WHERE
                  comment_id = $1
                RETURNING *;`;

  if (Object.keys(voteInc).length === 0) {
    voteInc = { inc_votes: 0 };
  }

  for (let key in voteInc) {
    if (key !== "inc_votes") {
      throw "Invalid field body";
    }
  }

  const result = await db.query(query, [id, voteInc.inc_votes]);

  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    return await checkExists("comments", "comment_id", id);
  }
};

exports.updateCommentBody = async (id, newCommentBody) => {
  const query = `UPDATE comments
                SET
                  body = $1
                WHERE
                  comment_id = $2
                RETURNING *`;

  const validFields = ["body"];

  for (let key in newCommentBody) {
    if (!validFields.includes(key)) {
      throw "Invalid field body";
    }
  }

  const result = await db.query(query, [newCommentBody.body, id]);

  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    return await checkExists("comments", "comment_id", id);
  }
};

exports.selectComments = async () => {
  const query = `SELECT
                  *
                FROM
                  comments;`;

  const result = await db.query(query);

  return result.rows;
};

exports.selectComment = async (commentId) => {
  // need to add tests for this
  const query = `SELECT
                  *
                FROM
                  comments
                WHERE
                  comment_id = $1;`;

  const result = await db.query(query, [commentId]);

  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    return await checkExists("comments", "comment_id", commentId);
  }
};
