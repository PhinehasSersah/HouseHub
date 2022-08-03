const multer = require("multer");
const sharp = require("sharp");
const { BadRequestError } = require("../errors");

//multer
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/users");
//   },
//   filename: (req, file, cb) => {
//     const extension = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.userId}-${Date.now()}.${extension}`);
//   },
// });

const multerStorage = multer.memoryStorage();

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

//Resizing images

const resizeImage = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.userId}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 70 })
    .toFile(`public/users/${req.file.filename}`);
    next()
};

module.exports = {
  upload,
  resizeImage,
};
