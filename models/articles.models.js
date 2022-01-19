const db = require("../db/connection");

exports.selectArticles = async (params) => {
  let query = `SELECT 
                    author, 
                    title,
                    articles.article_id, 
                    topic, 
                    created_at, 
                    votes, 
                    COALESCE(comment_count,0) AS comment_count
                  FROM 
                    articles 
                  LEFT JOIN 
                    (SELECT article_id AS comment_article_id, COUNT(comment_id)::int AS comment_count FROM comments GROUP BY 
                    article_id) AS comments_table
                  ON
                    articles.article_id = comment_article_id`;
  const validFields = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  let topic;

  [query, topic] = sanitiseOrderAndSortQueryParams(query, params, validFields);

  const result = await db.query(query, topic);

  if (result.rows.length > 0) {
    return result.rows;
  } else {
    return Promise.reject({ status: 400, message: "Invalid topic value" });
  }
};

exports.selectArticle = async (id) => {
  const query = `SELECT 
                    articles.author, 
                    title,
                    articles.article_id, 
                    articles.body,
                    topic, 
                    articles.created_at, 
                    articles.votes, 
                    CAST(comment_count AS int) 
                  FROM 
                    articles 
                  LEFT JOIN 
                    (SELECT article_id, count(comment_id) AS comment_count FROM comments GROUP BY 
                    article_id) AS comments_table
                  USING 
                    (article_id)
                  WHERE
                    articles.article_id = $1
                  ORDER BY 
                    articles.article_id
                  ;`;

  const result = await db.query(query, [id]);

  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    return Promise.reject({ status: 400, message: "Article does not exist" });
  }
};

exports.updateArticle = async (id, voteInc) => {
  const query = `UPDATE 
                    articles
                  SET 
                    votes = votes + $2
                  WHERE
                    article_id = $1
                  RETURNING *;`;

  const result = await db.query(query, [id, voteInc]);

  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    return Promise.reject({ status: 400, message: "Article does not exist" });
  }
};

const sanitiseOrderAndSortQueryParams = (query, params, validFields) => {
  const newParams = { ...params };
  const topic = [];

  const sortBy = newParams.sort_by || "created_at";
  let order = newParams.order || "DESC";
  order = order.toUpperCase();

  if (!validFields.includes(sortBy)) {
    throw "Invalid sort field";
  }

  if (!(order === "ASC" || order === "DESC")) {
    throw "Invalid order field";
  }

  if (params.topic) {
    topic.push(params.topic);
    query += ` WHERE topic = $1 `;
  }

  query += ` ORDER BY ${sortBy} ${order};`;

  return [query, topic];
};

exports.selectArticleComments = async (id) => {
  const query = `SELECT
                  articles.article_id,
                  comments.comment_id,
                  comments.votes,
                  comments.created_at,
                  comments.author,
                  comments.body
                FROM 
                  articles 
                LEFT JOIN
                  comments
                USING 
                  (article_id)
                WHERE
                  articles.article_id = $1;`;

  const result = await db.query(query, [id]);

  if (result.rows.length > 0) {
    if (result.rows[0].comment_id === null) {
      // check for articles that have 0 comments
      return [];
    } else {
      return result.rows;
    }
  } else {
    return Promise.reject({ status: 400, message: "Article does not exist" });
  }
};

exports.insertArticleComment = async (id, queryBody) => {
  const validFields = ["username", "body"];
  const query = `INSERT INTO 
                  comments( article_id, author, body)
                VALUES 
                  ($1, $2, $3)
                RETURNING *;`;

  for (const key in queryBody) {
    if (!validFields.includes(key)) {
      throw "Invalid field body";
    }
  }

  const result = await db.query(query, [
    id,
    queryBody.username,
    queryBody.body,
  ]);

  return result.rows[0];
};
