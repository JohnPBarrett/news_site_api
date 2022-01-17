exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(400).send({ message: err });
  } else {
    next(err);
  }
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22PO2") {
    res.status(400).send({ message: "Invalid input" });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: "Internal server error" });
};

exports.handleInvalidEndpointErrors = (req, res) => {
  res.status(404).send({ message: "Path not found" });
};
