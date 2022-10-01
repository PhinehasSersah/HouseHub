const express = require("express");
const userRouter = express.Router();
// const { upload, resizeUserImage } = require("../controllers/multer");
const authenticateUser = require("../middleware/authenticate");

const {
  register,
  login,
  editDetails,
  deleteUser,
  getUserDetails,
  handleLogout,
  uploadUserPhoto,
  resizeUserImage,
} = require("../controllers/auth");

userRouter.post(
  "/signup",
  uploadUserPhoto,
  resizeUserImage,

  register
);
userRouter.post("/login", login);
userRouter.get("/userdata", authenticateUser, getUserDetails);
userRouter.get("/logout", handleLogout);
userRouter
  .route("/profile/:id")
  .put(authenticateUser, uploadUserPhoto, resizeUserImage, editDetails)
  .delete(deleteUser);

module.exports = userRouter;
