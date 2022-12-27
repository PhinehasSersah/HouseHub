const { Server } = require("socket.io");
const corsOptions = require("../config/corsOptions");
const Message = require("../models/messages");
const {
  getLastRoomMessage,
  sortMessageByDate,
} = require("../utils/message.services");

module.exports = {
  socketIo: (server) => {
    const io = new Server(server, {
      cors: corsOptions,
    });
    // socket connection
    io.on("connection", (socket) => {
      // socket.on("message-owner", async (messageBody) => {
      //   // const { toUser, fromUser, message } = messageBody;
      //   // try {
      //   //   await Message.create({
      //   //     fromUser: fromUser,
      //   //     toUser: toUser,
      //   //     message: message,
      //   //     date: Date.now(),
      //   //   });

      //   // const messages = await Message.find({ fromUser, toUser });

      //   //  socket.emit("found-messages", messages)
      //   io.to(socket.id).emit("sent-messages", messageBody);
      //   // } catch (error) {
      //   //   console.log(error);
      //   //   throw error;
      //   // }
      // });

      // at chat page clicking on a user message
      socket.on("contact-user", async (newRoom, previousRoom) => {
        socket.join(newRoom);
        socket.leave(previousRoom);
        let roomMessages = await getLastRoomMessage(newRoom);
        roomMessages = sortMessageByDate(roomMessages);
        socket.emit("room-messages", roomMessages);
      });

      // sending messages
      socket.on("message-room", async (room, messageBody, from, date) => {
        await Message.create({
          room,
          messageBody,
          from,
          date,
        });
        let roomMessages = await getLastRoomMessage(room);
        roomMessages = sortMessageByDate(roomMessages);
        io.to(room).emit("room-messages", roomMessages);
      });

      console.log("connected to socket" + socket.id);
    });
  },
};
