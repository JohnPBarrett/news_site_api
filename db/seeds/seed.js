const db = require("../connection");
const createTables = require("../../utils/db/create_tables");
const insertTableData = require("../../utils/db/insert_table_data");
const format = require("pg-format");

const seed = async (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables
  try {
    await createTables();
    console.log("Tables successfully created");
  } catch (err) {
    console.error("error in creating tables", err);
    throw err;
  }
  // 2. insert data
  try {
    insertTableData(articleData, commentData, topicData, userData);
    console.log("Database successfully seeded");
  } catch (err) {
    console.error("error in inserting data", err);
    throw err;
  }
};

module.exports = seed;
