const Message = require("../models/messages");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const allUserMessages = async (req, res) => {
  const { userId } = req.user;

  try {
    const messages = await Message.find({ toUser: userId })
    
    res.status(StatusCodes.OK).json({ messages });
  } catch (error) {
    throw new BadRequestError(error);
  }
};

const userMessage = async (req, res) => {
  const {
    user: { userId },
    params: { id },
  } = req;

  try {
    const messages = await Message.find({ toUser: userId, fromUser: id });
    res.status(StatusCodes.OK).json({ messages });
  } catch (error) {
    throw new BadRequestError(error);
  }
};

module.exports = { allUserMessages, userMessage };
