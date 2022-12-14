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
      socket.on("message-owner", async (messageBody) => {
        const { toUser, fromUser, message } = messageBody;
        try {
          await Message.create({
            fromUser: fromUser,
            toUser: toUser,
            message: message,
            date: Date.now(),
          });

          const messages = await Message.find({ fromUser, toUser });

          //  socket.emit("found-messages", messages)
          socket.emit("found-messages", messages);
        } catch (error) {
          console.log(error);
          throw error;
        }
      });

      console.log("connected to socket" + socket.id);
    });
  },
};
