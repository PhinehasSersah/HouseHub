const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const sharp = require("sharp");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
// const { resizeHouseImage } = require("./multer");

// login handler
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide an email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid email");
  }

  const validatePassword = await user.comparePassword(password);
  if (!validatePassword) {
    throw new UnauthenticatedError("Invalid password");
  }
  const token = user.createJWT();
  const refreshToken = user.createRefreshJWT();

  res
    .cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 24 * 1000,
    })
    .status(StatusCodes.OK)
    .json({
      user,
      token,
    });
};

// register handler
const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: { firstname: user.firstname, lastname: user.lastname },
    token,
  });
};

// refresh handler

// if user email is not secured enough, I will use user.id as req.body
const getUserDetails = async (req, res) => {
  // const cookies = req.cookies;
  // if (!cookies?.jwt) {
  //   throw new UnauthenticatedError("Invalid credentials");
  // }
  // const refreshToken = cookies.jwt;
  // const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  // if (!payload) {
  //   throw new UnauthenticatedError("Invalid refresh token");
  // }
  const { userId } = req.user;
  if (!userId) {
    throw new UnauthenticatedError("Invalid user");
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new UnauthenticatedError("User not found");
  }

  res.status(StatusCodes.OK).json({
    user,
  });
};

// if user email is not secured enough, I will use user.id as req.body
const handleLogout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.status(StatusCodes.NO_CONTENT).send("No cookies");
  }
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  return res.status(StatusCodes.NO_CONTENT).send("cookies has been sent");
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new BadRequestError("Invalid file type, please upload image"));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
const uploadUserPhoto = upload.single("avatar");

const resizeUserImage = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${Math.floor(Math.random())}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/users/${req.file.filename}`);
  req.body.avatar = `/users/${req.file.filename}`;
  next();
};

// edit user handler
const editDetails = async (req, res) => {
  const {
    body: { firstname, lastname, email, newPassword, oldPassword, address },
    params: { id },
  } = req;
  if (!firstname || !lastname || !email) {
    throw new BadRequestError("Please provide firstname, lastname and email");
  }
  const { userId } = req.user;
  if (!userId) {
    throw new UnauthenticatedError("Invalid user");
  }
  const foundUser = await User.findById(id);
  if (newPassword === "" || undefined) {
    req.body.password = foundUser.password;
  } else {
    const validatePassword = await foundUser.comparePassword(oldPassword);
    if (!validatePassword) {
      throw new UnauthenticatedError("Invalid password");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    req.body.password = hashedPassword;
  }

  if (!req.file) {
    req.body.avatar = foundUser.avatar;
  }
  const user = await User.findByIdAndUpdate(
    {
      _id: userId,
    },
    req.body,
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.ACCEPTED).json({ user });
};

// delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndRemove({ _id: id });
    res.status(StatusCodes.OK).send("Account deleted successfully");
  } catch (err) {
    throw new BadRequestError("Something went wrong, please try again later");
  }
};

module.exports = {
  login,
  register,
  editDetails,
  deleteUser,
  getUserDetails,
  handleLogout,
  uploadUserPhoto,
  resizeUserImage,
};
