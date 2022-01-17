const db = require("../../db/connection");
const format = require("pg-format");

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

const insertTableData = async (
  topicData,
  userData,
  articleData,
  commentData
) => {


  await insertTopicData(topicData);
  await insertUserData(userData);
  await insertArticleData(articleData);
  await insertCommentData(commentData);
  return;
};

module.exports = insertTableData;
