const { Server } = require("socket.io");
const corsOptions = require("../config/corsOptions");
const Message = require("../models/messages");

module.exports = {
  socketIo: (server) => {
    const io = new Server(server, {
      cors: corsOptions,
    });
    // socket connection
    io.on("connection", (socket) => {
      socket.on("message-owner", async (from, to, message) => {
        try {
          await Message.create({
            fromUser: from,
            toUser: to,
            message: message,
            date: Date.now(),
          });

          const messages = await Message.find({ fromUser: from, toUser: to });

          //  socket.emit("found-messages", messages)
          io.to(socket.id).emit("found-messages", messages);
        } catch (error) {
          throw error;
        }
      });

      console.log("connected to socket" + socket.id);
    });
  },
};
