const express = require("express");
const messageRouter = express.Router();
const authenticateUser = require("../middleware/authenticate");
const { allUserMessages, userMessage } = require("../controllers/message")

messageRouter.route("/all-messages").get(authenticateUser, allUserMessages);

messageRouter.route("user-messages/:id").get(authenticateUser, userMessage);

module.exports = messageRouter;
