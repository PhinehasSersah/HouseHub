const express = require("express");
const houseRouter = express.Router();
const authenticateUser = require("../middleware/authenticate");
const { upload, resizeImage } = require("../controllers/multer");

const {
  getAllHouse,
  createHouse,
  updateHouse,
  deleteHouse,
  toggleRentedStatus,
} = require("../controllers/house");

houseRouter.route("/").get(getAllHouse);
houseRouter.route("/rentaplace").post(authenticateUser, createHouse);
houseRouter
  .route("/rentaplace/:id")
  .patch(authenticateUser, updateHouse)
  .delete(authenticateUser, deleteHouse);
houseRouter.route("/rented/:id").patch(authenticateUser, toggleRentedStatus);

module.exports = houseRouter;
