import io from "socket.io-client";

let socket;

const connectSocket = (token) => {
  socket = io(import.meta.env.VITE_API_URI, {
    auth: { token },
  });
  socket.connect();
};

export { socket, connectSocket };
