const express = require("express");
const messageRouter = express.Router();
const authenticateUser = require("../middleware/authenticate");
const { allUserMessages, sendMessage } = require("../controllers/message")

messageRouter.route("/all-messages").get(authenticateUser, allUserMessages);

messageRouter.route("/send-messages").post(authenticateUser, sendMessage);

module.exports = messageRouter;
