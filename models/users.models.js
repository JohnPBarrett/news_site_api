const db = require("../db/connection");
const { checkExists } = require("../utils/checkExists");

exports.selectUsers = async () => {
  const query = `SELECT
                username
              FROM
                users;`;

  const result = await db.query(query);
  return result.rows;
};

exports.selectUser = async (username) => {
  username = username.toLowerCase();
  const query = `SELECT
                  username, 
                  avatar_url,
                  name
                FROM 
                  users
                WHERE
                  username = $1`;

  const user = await db.query(query, [username]);

  if (user.rows.length === 0) {
    return await checkExists("users", "username", username);
  } else {
    return user.rows[0];
  }
};

exports.updateUser = async (username, requestBody) => {
  let query = "UPDATE users ";
  const validFields = ["avatar_url", "name"];
  const values = [];

  if (Object.keys(requestBody).length === 0) {
    return await module.exports.selectUser(username);
  }

  for (let key in requestBody) {
    if (!validFields.includes(key)) {
      throw "Invalid field body";
    }
  }

  for (let i = 0; i < Object.keys(requestBody).length; i++) {
    let key = Object.keys(requestBody)[i];
    let value = requestBody[key];
    if (i === 0) {
      query += " SET ";
    } else {
      query += " , ";
    }

    query += ` ${key} = $${i + 1} `;
    values.push(value);
  }

  query += ` WHERE username = $${values.length + 1} RETURNING *;`;

  const result = await db.query(query, [...values, username]);

  if (result.rows.length === 0) {
    return await checkExists("users", "username", username);
  }

  return result.rows[0];
};

exports.insertUser = async (newUser) => {
  let query = `INSERT INTO 
                users(username, name, avatar_url)
                VALUES 
                  ($1, $2, $3)
                RETURNING *;`;

  const validFields = ["username", "name", "avatar_url"];

  for (let key in newUser) {
    if (!validFields.includes(key)) {
      throw "Invalid field body";
    }
  }

  const result = await db.query(query, [
    newUser.username,
    newUser.name,
    newUser.avatar_url,
  ]);
  return result.rows[0];
};
