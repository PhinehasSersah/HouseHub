const express = require("express");
const userRouter = express.Router();
const { register, login , editDetails, deleteUser} = require("../controllers/auth");

userRouter.post("/signup", register);
userRouter.post("/login", login);
userRouter.route("/profile/:id").patch(editDetails).delete(deleteUser)

module.exports = userRouter;
