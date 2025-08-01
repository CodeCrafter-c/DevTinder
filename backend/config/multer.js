const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpeg, .jpg, and .png files are allowed"), false);
    }
  }
});

module.exports=upload