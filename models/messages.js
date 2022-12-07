const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    toUser: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
