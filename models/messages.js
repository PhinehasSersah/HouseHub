const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    messageBody: {
      type: String,
      required: true,
    },
    fromUser: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUser: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    socketId: {
      type: String,
      // required: [true, "Socket id required"],
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    room: {
      type: String,
      required: [true, "message room required"],
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
