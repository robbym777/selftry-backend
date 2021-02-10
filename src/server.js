const http = require("http");
const express = require("express");
const appMiddlewares = require("./middlewares/app-middleware");
const appRoutes = require("./routes/index.js");
const logEvent = require("./events/myEmitter");
const loggingListener = require("./events/logging.listener");

const app = express();
loggingListener();
app.use(appMiddlewares);
app.use(appRoutes);

const server = http.createServer(app);

server.on("error", function (e) {
  logEvent.emit("APP-ERROR", {
    logTitle: "APP-FAILED",
    logMessage: e,
  });
});

module.exports = server;
