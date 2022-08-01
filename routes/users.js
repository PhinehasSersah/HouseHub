const express = require("express");
const userRouter = express.Router();
const multer = require("multer");
const {
  register,
  login,
  editDetails,
  deleteUser,
} = require("../controllers/auth");

//multer
const upload = multer({ dest: "public/users" });

userRouter.post("/signup", register);
userRouter.post("/login", login);
userRouter
  .route("/profile/:id")
  .patch(upload.single("avatar"), editDetails)
  .delete(deleteUser);

module.exports = userRouter;
