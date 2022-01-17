const db = require("../../db/connection");

const createTopicsTable = async () => {
  const query = `DROP TABLE IF EXISTS topics;
                CREATE TABLE topics (
                  slug VARCHAR(255) UNIQUE PRIMARY KEY,
                  description VARCHAR(255) NOT NULL
                );`;
  return db.query(query);
};

const createUsersTable = async () => {
  const query = `DROP TABLE IF EXISTS users;
                CREATE TABLE users (
                  username VARCHAR(30) UNIQUE PRIMARY KEY,
                  avatar_url TEXT,
                  name VARCHAR(30) NOT NULL
                );`;

  return db.query(query);
};

const createArticlesTable = async () => {
  const query = `DROP TABLE IF EXISTS articles;
                CREATE TABLE articles (
                  article_id SERIAL PRIMARY KEY,
                  title VARCHAR(255) NOT NULL,
                  body TEXT NOT NULL,
                  votes INTEGER DEFAULT 0,
                  topic VARCHAR(255) REFERENCES topics(slug),
                  author VARCHAR(30) REFERENCES users(username),
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );`;

  return db.query(query);
};

const createCommentTable = async () => {
  const query = `CREATE TABLE comments (
                    comment_id SERIAL PRIMARY KEY,
                    author VARCHAR(30) REFERENCES users(username),
                    article_id INT REFERENCES articles(article_id),
                    votes INT DEFAULT 0,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    body TEXT NOT NULL
                  );`;

  return db.query(query);
};

const dropTables = async () => {
  const query = `DROP TABLE IF EXISTS comments;
                  DROP TABLE IF EXISTS articles;
                  DROP TABLE IF EXISTS users;
                  DROP TABLE IF EXISTS topics;`;

  return db.query(query);
};

const createTables = async () => {
  await dropTables();
  await createTopicsTable();
  await createUsersTable();
  await createArticlesTable();
  await createCommentTable();
  return;
};

module.exports = createTables;
