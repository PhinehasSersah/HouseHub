const User = require("../models/user");
const Message = require("../models/messages");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const {getLastRoomMessage} =require("../utils/message.services")

const allUserMessages = async (req, res) => {
  const { userId } = req.user;
  try {
    const sentMessages = await Message.find({ sender: userId });
    const receivedMessages = await Message.find({ receiver: userId });

    res.status(StatusCodes.OK).json({
      messages: {
        sent: sentMessages,
        to: receivedMessages,
      },
    });
  } catch (error) {
    console.log("key", error);
    throw new BadRequestError(error);
  }
};

const sendMessage = async (req, res) => {
  const { fromUser, toUser, messageBody, date, room } = req.body;
  try {
    await Message.create({
      fromUser,
      toUser,
      messageBody,
      date,
      room,
    });

    const messages = await getLastRoomMessage(room)
    res.status(StatusCodes.OK).json({ messages });
  } catch (error) {
    throw new BadRequestError(error);
  }
};

module.exports = { allUserMessages, sendMessage };
