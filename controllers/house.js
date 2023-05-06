const House = require("../models/house");
const multer = require("multer");
const sharp = require("sharp");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

// multer image processing
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

const uploadSpaceImages = upload.array("images", 4);
// creating a new house
const resizeHouseImage = async (req, res, next) => {
  if (!req.files) return next();

  // if(req.file.length ===1) {

  // }

  req.body.images = [];

  await Promise.all(
    req.files.map((file, index) => {
      const filename = `house-${req.user.userId}-${Date.now()}-${
        index + 1
      }.jpeg`;
      sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/house/${filename}`);
      req.body.images.push(`/house/${filename}`);
    })
  );

  next();
};
const createHouse = async (req, res) => {
  const { type, description, address, price, location, images } = req.body;
  if (!type || !description || !address || !price || !location || !images) {
    throw new BadRequestError("Please provide all required fields");
  }
  req.body.createdById = req.user.userId;
  try {
    await House.create(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "Space created successfully" });
  } catch (error) {
    throw new error();
  }
};
// getting all the house in the database
const getAllHouse = async (req, res) => {
  const { type, location, price, rooms } = req.query;
  let queryObj = {};
  if (type) {
    queryObj.type = { $regex: type, $options: "i" };
  }
  if (location) {
    queryObj.location = { $regex: location, $options: "i" };
  }
  if (price) {
    if (Number(price) === 500) {
      queryObj.price = { $lte: Number(price) };
    }
    if (Number(price) === 1000) {
      queryObj.price = { $lte: Number(price), $gte: 500 };
    }
    if (Number(price) === 5000) {
      queryObj.price = { $lte: Number(price), $gte: 1000 };
    }
    if (Number(price) === 5001) {
      queryObj.price = { $gte: Number(price) };
    }
  }
  if (rooms) {
    if (Number(rooms) === 5) {
      queryObj.rooms = { $gte: Number(rooms) };
    } else {
      queryObj.rooms = { $lte: Number(rooms), $gte: Number(rooms) };
    }
  }

  try {
    const house = await House.find(queryObj)
      .populate("createdById", ["firstname", "lastname", "avatar"])
      .sort("-createdAt");
    res.status(StatusCodes.OK).json({ house });
  } catch (error) {
    throw new error();
  }
};

// updating house details
const updateHouse = async (req, res) => {
  const {
    params: { id: houseId },
    user: { userId },
  } = req;
  try {
    const house = await House.findOneAndUpdate(
      { _id: houseId, createdBy: userId },
      req.body,
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json({ house });
  } catch (error) {
    throw new BadRequestError("Could not update house, please try again");
  }
};
const deleteHouse = async (req, res) => {
  try {
    const {
      params: { id: houseId },
      user: { userId },
    } = req;
    await House.findByIdAndRemove({ _id: houseId, createdBy: userId });
    res.status(StatusCodes.OK).json({ msg: "House deleted successfully" });
  } catch (error) {
    throw new BadRequestError("Unable to delete house, please try again");
  }
};
const getUserHouses = async (req, res) => {
  const { userId } = req.user;
  try {
    const house = await House.find({ createdById: userId }).populate(
      "createdById",
      ["firstname", "lastname", "avatar"]
    );
    res.status(StatusCodes.OK).send({ house, count: house.length });
  } catch (error) {
    throw new BadRequestError("Unable to find your spaces, please try again");
  }
};
const toggleRentedStatus = async (req, res) => {
  const {
    body: { rentedStatus },
    // user: { userId },
    params: { id: houseId },
  } = req;
  if (rentedStatus === null || undefined)
    throw new BadRequestError("Please select rented status");
  try {
    const rented = await House.findByIdAndUpdate(
      {
        _id: houseId,
        // createdById: userId,
      },
      req.body,
      { new: true, runValidators: true }
    );
    res.status(StatusCodes.OK).json(rented.rentedStatus);
  } catch (error) {
    throw new BadRequestError("Something went wrong, please try again");
  }

  // res.send("toggle house rented status...");
};

module.exports = {
  getAllHouse,
  createHouse,
  updateHouse,
  getUserHouses,
  deleteHouse,
  toggleRentedStatus,
  uploadSpaceImages,
  resizeHouseImage,
};
