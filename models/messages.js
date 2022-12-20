const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
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

    messageBody: {
      type: String,
      // required: true,
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
