const db = require("../db/connection");

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
    return Promise.reject({ status: 400, message: "User does not exist" });
  } else {
    return user.rows[0];
  }
};
