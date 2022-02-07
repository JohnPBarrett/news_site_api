const express = require("express");
const cors = require("cors");
const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
  handleInvalidEndpointErrors,
} = require("./errors");

const app = express();
app.use(cors());
const apiRouter = require("./routes/apiRouter");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
app.use(handleInvalidEndpointErrors);

module.exports = app;
