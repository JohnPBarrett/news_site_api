const db = require("../db/connection");

exports.selectArticle = async (id) => {
  const query = `SELECT 
                    articles.author, 
                    title,
                    articles.article_id, 
                    articles.body,
                    topic, 
                    articles.created_at, 
                    articles.votes, 
                    CAST(count(comment_id) AS int) AS comment_count
                  FROM 
                    articles 
                  LEFT JOIN 
                    comments 
                  USING 
                    (article_id)
                  WHERE
                    articles.article_id = $1  
                  GROUP BY 
                    articles.article_id;`;

  const result = await db.query(query, [id]);

  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    return Promise.reject({ status: 400, message: "Article does not exist" });
  }
};
