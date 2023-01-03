const express = require("express");
const messageRouter = express.Router();
const authenticateUser = require("../middleware/authenticate");
const { allUserMessages, sendMessage, getClientMessage, deleteSingleMessage } = require("../controllers/message")

messageRouter.route("/all-messages").get(authenticateUser, allUserMessages);

messageRouter.route("/send-messages").post(authenticateUser, sendMessage);
messageRouter.route("/client-messages/:room").get(authenticateUser, getClientMessage);
messageRouter.route("/delete-single-message/:id").delete(authenticateUser, deleteSingleMessage);

module.exports = messageRouter;
