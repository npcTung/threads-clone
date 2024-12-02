const jwt = require("jsonwebtoken");

module.exports = (socket, next) => {
  const token = socket.handshake.auth?.token;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    socket.user = decoded;
  } catch (error) {
    const socketError = new Error("NOT_AUTHORIZED");
    return next(socketError);
  }
  next();
};
