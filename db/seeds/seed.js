const db = require("../connection");
const { createTables } = require("./create_tables");
const format = require("pg-format");

const seed = async (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables
  await createTables();
  // console.log(topicData);
  // 2. insert data
  await insertTopicData(topicData);
  await insertUserData(userData);
  await insertArticleData(articleData);
  await insertCommentData(commentData);
  console.log("database successfully seeded");
};

const insertTopicData = async (topicData) => {
  const query = format(
    `INSERT INTO 
    topics (slug, description)
    VALUES 
    %L;`,
    topicData.map((topic) => [topic.slug, topic.description])
  );

  return db.query(query);
};

const insertUserData = async (userData) => {
  const query = format(
    `INSERT INTO
    users (username, avatar_url, name)
    VALUES
    %L`,
    userData.map((user) => [user.username, user.avatar_url, user.name])
  );

  return db.query(query);
};

const insertArticleData = async (articleData) => {
  const query = format(
    `
  INSERT INTO 
    articles (title, body, votes, topic, author, created_at)
  VALUES 
    %L;`,
    articleData.map((article) => [
      article.title,
      article.body,
      article.votes,
      article.topic,
      article.author,
      article.created_at,
    ])
  );

  return db.query(query);
};

const insertCommentData = async (commentData) => {
  const query = format(
    `
  INSERT INTO
    comments(author, article_id, votes, created_at, body)
  VALUES
    %L`,
    commentData.map((comment) => [
      comment.author,
      comment.article_id,
      comment.votes,
      comment.created_at,
      comment.body,
    ])
  );
  return db.query(query);
};

module.exports = seed;
