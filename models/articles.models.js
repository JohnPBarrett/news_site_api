const db = require("../db/connection");

exports.selectArticles = async (params) => {
  let query = `   SELECT 
                    author, 
                    title,
                    articles.article_id, 
                    topic, 
                    created_at, 
                    votes, 
                    COALESCE(comment_count,0) AS comment_count, 
                    CAST(COUNT(*) OVER () AS int) AS total_count
                  FROM 
                    articles 
                  LEFT JOIN 
                    (SELECT article_id AS comment_article_id, COUNT(comment_id)::int AS comment_count FROM comments GROUP BY 
                    article_id) AS comments_table
                  ON
                    articles.article_id = comment_article_id
               `;
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

  [query, topic] = sanitiseQuery(query, params, validFields);

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

exports.insertArticle = async (queryBody) => {
  let query = `INSERT INTO 
                articles(author, title, body, topic)
              VALUES
                ($1, $2, $3, $4)
              RETURNING *`;
  const validFields = ["author", "title", "body", "topic"];

  for (let key in queryBody) {
    if (!validFields.includes(key)) {
      throw "Invalid field body";
    }
  }

  const result = await db.query(query, [
    queryBody.author,
    queryBody.title,
    queryBody.body,
    queryBody.topic,
  ]);

  let newArticle = result.rows[0];
  newArticle.comment_count = 0;

  return newArticle;
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

const sanitiseQuery = (query, params, validFields) => {
  const newParams = { ...params };
  const topic = [];

  const sortBy = newParams.sort_by || "created_at";
  let order = newParams.order || "DESC";
  let limit;
  let offset;

  // santise for sort & order params
  order = order.toUpperCase();

  if (!validFields.includes(sortBy)) {
    throw "Invalid sort field";
  }

  if (!(order === "ASC" || order === "DESC")) {
    throw "Invalid order field";
  }

  [limit, offset] = santiseLimitAndOffset(newParams.limit, newParams.p);

  if (params.topic) {
    topic.push(params.topic);
    query += `  WHERE topic = $1 `;
  }

  query += ` ORDER BY ${sortBy} ${order}`;

  query += ` LIMIT ${limit} OFFSET ${offset};`;

  return [query, topic];
};

const santiseLimitAndOffset = (queryLimit, queryOffset) => {
  let limit;
  let offset;

  // sanitise for limit and page params
  if (queryLimit && queryLimit > 0) {
    limit = queryLimit;
  } else {
    limit = 10;
  }

  if (queryOffset && queryOffset > 0) {
    offset = (queryOffset - 1) * limit;
  } else {
    offset = 0;
  }
  return [limit, offset];
};

exports.selectArticleComments = async (id, params) => {
  let query = `SELECT
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
                  articles.article_id = $1`;
  const newParams = { ...params };
  let [limit, offset] = santiseLimitAndOffset(newParams.limit, newParams.p);

  query += ` LIMIT ${limit} OFFSET ${offset};`;

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
