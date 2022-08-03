const express = require("express");
const userRouter = express.Router();
const { upload, resizeImage } = require("../controllers/multer");
const authenticateUser = require("../middleware/authenticate");

const {
  register,
  login,
  editDetails,
  deleteUser,
} = require("../controllers/auth");

userRouter.post("/signup", register);
userRouter.post("/login", login);
userRouter
  .route("/profile/:id")
  .patch(authenticateUser, upload.single("avatar"), resizeImage, editDetails)
  .delete(deleteUser);

module.exports = userRouter;
