const House = require("../models/house");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

// creating a new house
const createHouse = async (req, res) => {
  const { type, description, address, price, location } = req.body;
  if (!type || !description || !address || !price || !location) {
    throw new BadRequestError("Please provide all required fields");
  }
  req.body.createdBy = req.user.userId;

  try {
    const house = await House.create(req.body);
    res.status(StatusCodes.CREATED).json({ house });
  } catch (error) {
    throw new error();
  }
};
// getting all the house in the database
const getAllHouse = async (req, res) => {
  try {
    const house = await House.find({});
    res.status(StatusCodes.OK).json({ house });
  } catch (error) {
    throw new error();
  }
};
// updating house details
const updateHouse = async (req, res) => {
  const {
    body: { type, description, address, price, location },
    params: { id: houseId },
    user: { userId },
  } = req;
  if (!type || !description || !address || !price || !location) {
    throw new BadRequestError("Please provide all required fields");
  }
  try {
    const house = await House.findByIdAndUpdate(
      { _id: houseId, createdBy: userId },
      req.body,
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json({ house });
  } catch (error) {
    throw new BadRequestError("Something went wrong, please try again");
  }
};
const deleteHouse = async (req, res) => {
  try {
    const {
      params: { id: houseId },
      user: { userId },
    } = req;
    await House.findByIdAndRemove({ _id: houseId, createdBy: userId });
  } catch (error) {
    throw new BadRequestError("Unable to delete, please try again");
  }
};
const toggleRentedStatus = async (req, res) => {
  const {
    body: { rentedStatus },
    user: { userId },
    params: { id: houseId },
  } = req;
  if (!rentedStatus) throw new BadRequestError("Please select rented status");
  try {
    const rented = await House.findByIdAndUpdate(
      {
        _id: houseId,
        createdBy: userId,
      },
      req.body.rentedStatus,
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json(rented.rentedStatus);
  } catch (error) {
    throw new BadRequestError("Something went wrong, please try again");
  }

  res.send("toggle house rented status...");
};

module.exports = {
  getAllHouse,
  createHouse,
  updateHouse,
  deleteHouse,
  toggleRentedStatus,
};
