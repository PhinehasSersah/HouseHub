const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    messageBody: {
      type: String,
      required: true,
    },
    from: {
      type: Object,
      required: [true, "Message sender cannot be empty"],
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
