const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { resizeHouseImage } = require("./multer");

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
      maxAge: 60 * 60 * 24 * 1000,
    })
    .status(StatusCodes.OK)
    .json({
      user: { firstname: user.firstname, lastname: user.lastname },
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
const handleRefreshToken = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new UnauthenticatedError("Missing user email address");
  }
  const cookies = req.cookies;
  if (!cookies.jwt) {
    throw new UnauthenticatedError("Invalid credentials");
  }
  
  const refreshToken = cookies.jwt;
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid user");
  }
  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  if (!payload) {
    throw new UnauthenticatedError("Invalid refresh token");
  }
  const token = user.createJWT();
  res.json({ token });
};
// logout handler

// if user email is not secured enough, I will use user.id as req.body
const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return res.status(StatusCodes.NO_CONTENT);
  }
  const refreshToken  = cookies.jwt

  const { email } = req.body;
  if (!email) {
    return new UnauthenticatedError("Unauthorized user");
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res
    .status(StatusCodes.NO_CONTENT)
    .clearCookie("jwt", { httpOnly: true, maxAge: 60 * 60 * 24 * 1000 })
  }

  res
  .clearCookie("jwt", { httpOnly: true, maxAge: 60 * 60 * 24 * 1000 })
  .status(StatusCodes.NO_CONTENT)
};

// edit user handler
const editDetails = async (req, res) => {
  const {
    body: { firstname, lastname, email },
    params: { id },
  } = req;
  if (!firstname || !lastname || !email) {
    throw new BadRequestError("Please provide firstname, lastname and email");
  }
  if (req.file) {
    req.body.avatar = req.file.filename;
  }
  const user = await User.findByIdAndUpdate(
    {
      _id: id,
    },
    req.body,
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.ACCEPTED).json({ user });
};
const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await User.findByIdAndRemove({ _id: userId });
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
  handleRefreshToken,
  handleLogout,
};
