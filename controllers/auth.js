const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

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
  res.status(StatusCodes.OK).json({
    user: { firstname: user.firstname, lastname: user.lastname },
    token: token,
  });
};
const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: { firstname: user.firstname, lastname: user.lastname },
    token,
  });
};
const editDetails = async (req, res) => {
  const {
    body: { firstname, lastname, email },
    params: { id },
  } = req;
  if (!firstname || !lastname || !email) {
    throw new BadRequestError("Please provide firstname, lastname and email");
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
};
