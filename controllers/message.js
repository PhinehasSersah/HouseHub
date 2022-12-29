const User = require("../models/user");
const Message = require("../models/messages");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { getLastRoomMessage } = require("../utils/message.services");

const allUserMessages = async (req, res) => {
  const { userId } = req.user;
  console.log(userId);
  try {
    const allUsers = await User.find({});
    let allUserIds = [];
    allUserIds = allUsers.map((user) => {
      return user._id;
    });
    let messages = [];

    const orderIds = (id1, id2) => {
      if (id1 > id2) {
        return id1 + "-" + id2;
      } else {
        return id2 + "-" + id1;
      }
    };

    for (let i = 0; i < allUserIds.length; i++) {
      const roomId = orderIds(userId, allUserIds[i]);
      const roomMessages = await Message.find({ room: roomId })
        .populate("fromUser", ["firstname", "lastname", "avatar", "status"])
        .populate("toUser", ["firstname", "lastname", "avatar", "status"])
        .sort("date");
            if (roomMessages.length > 0) {
        messages.push(roomMessages);
      }
    }
    res.status(StatusCodes.OK).json({
      messages,
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

    const messages = await getLastRoomMessage(room);
    res.status(StatusCodes.OK).json({ messages });
  } catch (error) {
    throw new BadRequestError(error);
  }
};

module.exports = { allUserMessages, sendMessage };
