const { Server } = require("socket.io");
const corsOptions = require("../config/corsOptions");
const Message = require("../models/messages");
const {
  getLastRoomMessage,
  sortRoomMessagesByDate,
} = require("../utils/message.services");

module.exports = {
  socketIo: (server) => {
    const io = new Server(server, {
      cors: corsOptions,
    });
    // socket connection
    io.on("connection", (socket) => {

      // at chat page clicking on a user message
      socket.on("contact-user", async (newRoom, previousRoom) => {
        socket.join(newRoom);
        socket.leave(previousRoom);
        let roomMessages = await getLastRoomMessage(newRoom);
        // roomMessages = sortMessageByDate(roomMessages);
        socket.emit("room-messages", roomMessages);
      });

      // sending messages
      socket.on("message-owner", async (room, previousRoom, messageBody, fromUser, toUser, date) => {
        socket.leave(previousRoom)
        socket.join(room);
        await Message.create({
          messageBody,
          fromUser,
          toUser,
          room,
          socketId: socket.id,
          date,
        });
        let roomMessages = await getLastRoomMessage(room);
        // roomMessages = sortRoomMessagesByDate(roomMessages);
        io.to(room).emit("room-messages", roomMessages);
      });

      console.log("connected to socket" + socket.id);
    });
  },
};
