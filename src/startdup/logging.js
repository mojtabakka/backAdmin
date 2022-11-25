require("express-async-errors");
const winston = require("winston");

module.exports = function () {
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  process.on("uncaughtException", (ex) => {
    console.log(ex);
    winston.error(ex.message, ex);
    process.exit(1);
  });
  process.on("unhandledRejection", () => {
    console.log(ex);
    winston.error(ex.message, ex);
    process.exit(1);
  });
};
