const authSocket = require("./middlewares/authSocket");

const registerSocketServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: process.env.URI_CLIENT,
      method: ["GET", "PORT", "PUT", "DELETE"],
    },
  });

  io.use((socket, next) => {
    authSocket(socket, next);
  });

  io.on("connection", (socket) => {
    console.log("user connected.");
    console.log(socket.id);
  });

  setInterval(() => {
    // emit online user
  }, [1000 * 8]);
};

module.exports = { registerSocketServer };
