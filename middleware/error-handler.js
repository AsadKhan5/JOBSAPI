// const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "something went wrong Please try again after some time",
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message });
  // }
  if (err.name === "ValidationError") {
    customError.statusCode = 400;
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(" or ");
  }
  if (err.name === "CastError") {
    customError.statusCode = 400;
    customError.msg = `Do not have any job of ${err.value} `;
  }

  if (err.code && err.code === 11000) {
    customError.statusCode = 400;
    customError.msg = `Already registered ${Object.values(
      err.keyValue
    )} you have to login `;
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
  // return res.status(500).json(err);
};

module.exports = errorHandlerMiddleware;
