const { Server } = require("socket.io");
const corsOptions = require("../config/corsOptions");

module.exports = {
  socketIo: (server) => {
    const io = new Server(server, {
      cors: corsOptions,
    });
    io.on('connection', (socket) => {
        console.log('connected to socket'+ socket.id)
    })
  },
};
