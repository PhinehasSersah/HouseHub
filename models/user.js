const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please provide your firstname"],
    minlength: 3,
    maxlength: 100,
  },
  lastname: {
    type: String,
    required: [true, "Please provide your lastname"],
    minlength: 3,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, "Please provide a valid email address"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email address",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
  phone: {
    type: Number,
    minlength: 3,
    maxlength: 100,
  },
  address: {
    type: String,
    minlength: 3,
    maxlength: 200,
  },
  avatar: {
    type: Buffer,
    contentType: String,
    minlength: 3,
    maxlength: 100,
  },
});

// hashing user password
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// creating json web token
UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, fullName: `${this.firtname} ${this.lastname}` },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

// comparing passwords
UserSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
