const mongoose = require("mongoose");
const HouseSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Appartment", "Condo", "Family house", "Semi-Detached"],
      required: [true, "Please select type of house"],
    },
    description: {
      type: String,
      required: [true, "Please describe your house"],
      maxlength: 255,
    },
    address: {
      type: String,
      required: [true, "Please enter the house address"],
      maxlength: 225,
    },
    price: {
      type: Number,
      required: [true, "Please enter the price per month"],
      maxlength: 255,
    },
    location: {
      type: String,
      required: [true, "Please describe your house"],
      maxlength: 255,
    },
    images: {
      type: [String],
      required: [true, "Please upload house images"]
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
    rentedStatus: {
      type:Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const House = mongoose.model("House", HouseSchema);

module.exports = House;
