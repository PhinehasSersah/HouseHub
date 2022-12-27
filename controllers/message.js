const User = require("../models/user");
const Message = require("../models/messages");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

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
  const { fromUser, toUser, messageBody } = req.body;
  try {
    const message = await Message.create({
      receiver: toUser,
      date: Date.now(),
      messageBody: {
        text: messageBody,
        date: Date.now(),
        seen: false,
      },
      sender: fromUser,
    });
    // const user = await User.findById(userId)
    // const newMessages = await Message.create({
    //   fromUser: fromUser,
    //   toUser: toUser,
    //   messageBody: messageBody,
    //   date: Date.now(),
    // });
    // const messageSender = await User.findById(fromUser);
    // messageSender.messages = newMessages._id;
    // const messageReceiver = await User.findById(toUser);
    // messageReceiver.messages = newMessages._id;
    // await messageSender.save();
    // await messageReceiver.save();
    res.status(StatusCodes.OK).json({ message });
  } catch (error) {
    throw new BadRequestError(error);
  }
};

module.exports = { allUserMessages, sendMessage };
