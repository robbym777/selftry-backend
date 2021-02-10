const dotenv = require("dotenv");
const server = require("./src/server");
const logEvent = require("./src/events/myEmitter");
const connection = require("./config/dbConn");

dotenv.config();
if (process.env.APP_NAME) {
  connection.authenticate().then(() => {
    server.listen(process.env.APP_PORT, "0.0.0.0", function () {
      if (server.listening) {
        logEvent.emit("APP-INFO", {
          logTitle: "SERVER",
          logMessage: `Server is listening on port ${process.env.APP_PORT}`,
        });
      }
    });
  }).catch((err) => {
    logEvent.emit("APP-ERROR", {
      logTitle: "DB-FAILED",
      logMessage: err,
    });
  });
} else {
  process.exit(1);
}
