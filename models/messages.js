const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    fromUser: {
      type: String,
      // required: true,
    },
    toUser: {
      type: String,
      // required :true
    },
    message: {
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
