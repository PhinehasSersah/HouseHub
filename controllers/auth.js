const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");



const login = (req, res) => {
  res.send("hitting the login endpoint");
};
const register = (req, res) => {
  res.send("hitting the registering user endpoint");
};

module.exports = {
  login,
  register,
};
