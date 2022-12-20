const User = require("../models/user");
const Message = require("../models/messages");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const allUserMessages = async (req, res) => {
  const { userId } = req.user;

  try {
    const messages = await User.findById(userId);

    res.status(StatusCodes.OK).json({ messages });
  } catch (error) {
    throw new BadRequestError(error);
  }
};

const sendMessage = async (req, res) => {
  const { fromUser, toUser, messageBody } = req.body;
  try {
    // const user = await User.findById(userId)
    const messages = await Message.create({fromUser:fromUser, toUser:toUser, messageBody: messageBody, date: Date.now()});
    res.status(StatusCodes.OK).json({ messages });
  } catch (error) {
    throw new BadRequestError(error);
  }
};

module.exports = { allUserMessages, sendMessage };
