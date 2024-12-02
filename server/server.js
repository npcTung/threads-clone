const app = require("./app");
const socketServer = require("./socketServer");

const port = process.env.PORT || 8088;

process.on("uncaughtException", (err) => {
  console.error(err);
  process.exit(1);
});

const http = require("http");

const server = http.createServer(app);
socketServer.registerSocketServer(server);

server.listen(port, () => {
  console.log("Server running on port:", port);
});

process.on("unhandledRejection", (err) => {
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});
