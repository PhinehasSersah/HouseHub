const House = require("../models/house");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const createHouse = (req, res) => {
  res.send("Creating a new House ...");
};
const getAllHouse = (req, res) => {
  res.send("Getting all houses in database ...");
};
const updateHouse = (req, res) => {
  res.send("Updating the current House data...");
};
const deleteHouse = (req, res) => {
  res.send("Deleting a House ...");
};
const toggleRentedStatus = (req, res) => {
  res.send("toggle house rented status...");
};

module.exports = {
  getAllHouse,
  createHouse,
  updateHouse,
  deleteHouse,
  toggleRentedStatus,
};
