const Message = require("../models/messages");

const getLastRoomMessage = async (room) => {
  let roomMessages = await Message.aggregate([
    { $match: { room: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
};

const sortMessageByDate = (message) => {
  return message.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");
    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];
    return date1 < date2 ? -1 : 1;
  });
};

module.exports = { getLastRoomMessage , sortMessageByDate};
