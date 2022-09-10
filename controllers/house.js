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
  // req.body.createdUser = req.user.name;

  try {
    const house = await House.create(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "Space created successfully", house });
  } catch (error) {
    throw new error();
  }
};
// getting all the house in the database
const getAllHouse = async (req, res) => {
  try {
    const house = await House.find({}).populate("createdById", [
      "firstname",
      "lastname",
      "avatar",
    ]);
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
    res.status(StatusCodes.OK).json({ msg: "House deleted successfully" });
  } catch (error) {
    throw new BadRequestError("Unable to delete house, please try again");
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
    const rented = await House.findOneAndUpdate(
      {
        _id: houseId,
        createdBy: userId,
      },
      req.body,
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
  uploadSpaceImages,
  resizeHouseImage,
};
