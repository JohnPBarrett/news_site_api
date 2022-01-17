const db = require("../db/connection");

exports.selectArticle = async (id) => {
  const query = `SELECT 
                  * 
                FROM 
                  articles 
                WHERE
                  article_id = $1;`;

  const result = await db.query(query, [id]);

  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    return Promise.reject({ status: 400, message: "Article does not exist" });
  }
};
