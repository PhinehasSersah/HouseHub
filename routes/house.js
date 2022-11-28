const express = require("express");
const houseRouter = express.Router();
const authenticateUser = require("../middleware/authenticate");
// const { upload, resizeHouseImage , huouseUpload} = require("../controllers/multer");

const {
  getAllHouse,
  createHouse,
  updateHouse,
  deleteHouse,
  getUserHouses,
  toggleRentedStatus,
  uploadSpaceImages,
  resizeHouseImage,
} = require("../controllers/house");

houseRouter.route("/").get(getAllHouse);
houseRouter
  .route("/rentaplace")
  .post(authenticateUser, uploadSpaceImages, resizeHouseImage, createHouse)
  .get(authenticateUser, getUserHouses);
houseRouter
  .route("/rentaplace/:id")
  .put(
    authenticateUser,
    uploadSpaceImages,
    resizeHouseImage,
    updateHouse
  )
  .delete(authenticateUser, deleteHouse);
houseRouter.route("/rented/:id").put(authenticateUser, toggleRentedStatus);

module.exports = houseRouter;
