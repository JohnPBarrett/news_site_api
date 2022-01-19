const fs = require("fs/promises");

exports.apiController = async (req, res, next) => {
  const endpointData = await fs.readFile(
    `${__dirname}/../endpoints.json`,
    "utf-8"
  );

  res.status(200).send(endpointData);
};
