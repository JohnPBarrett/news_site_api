exports.handleCustomErrors = (err, req, res, next) => {
  // for when errors are thrown and only receive an error message
  const customErrorMessages = [
    "Invalid field body",
    "Invalid sort field",
    "Invalid order field",
  ];
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else if (customErrorMessages.includes(err)) {
    res.status(400).send({ message: err });
  } else {
    next(err);
  }
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Invalid input" });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: "Internal server error" });
};

exports.handleInvalidEndpointErrors = (req, res, next) => {
  res.status(404).send({ message: "Path not found" });
};
