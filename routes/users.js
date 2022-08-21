const express = require("express");
const userRouter = express.Router();
const { upload, resizeUserImage } = require("../controllers/multer");
const authenticateUser = require("../middleware/authenticate");

const {
  register,
  login,
  editDetails,
  deleteUser,
  handleRefreshToken,
  handleLogout
} = require("../controllers/auth");

userRouter.post("/signup", register);
userRouter.post("/login", login);
userRouter.get("/refresh", handleRefreshToken);
userRouter.get("/logout", handleLogout);
userRouter
  .route("/profile/:id")
  .patch(authenticateUser, upload.single("avatar"), resizeUserImage, editDetails)
  .delete(deleteUser);

module.exports = userRouter;
