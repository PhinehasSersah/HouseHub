const express = require("express");
const userRouter = express.Router();
const { register, login } = require("../controllers/auth");

userRouter.post("/signup", register);
userRouter.post("/login", login);

module.exports = userRouter;
