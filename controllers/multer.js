const multer = require("multer");
const { BadRequestError } = require("../errors");

//multer
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/users");
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.userId}-${Date.now()}.${extension}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(BadRequestError("Please upload on image"), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

module.exports = upload;
