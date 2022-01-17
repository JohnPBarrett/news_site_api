const db = require("../connection");
const { createTables } = require("./create_tables");

const seed = (data) => {
  //const { articleData, commentData, topicData, userData } = data;
  // 1. create tables
  await createTables();

  // 2. insert data
};

seed();

module.exports = seed;
