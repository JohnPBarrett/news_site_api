const createTables = require("../../utils/create_tables");
const insertTableData = require("../../utils/insert_table_data");

const seed = async (data) => {
  const { topicData, userData, articleData, commentData } = data;
  // 1. create tables

  try {
    await createTables();
  } catch (err) {
    throw err;
  }
  // 2. insert data
  try {
    await insertTableData(topicData, userData, articleData, commentData);
  } catch (err) {
    throw err;
  }
};

module.exports = seed;
