const multer = require("multer");
const multerConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/users/");
  },
  filename: (req, file, callback) => {
    const ext = file.mimetype.split("/")[1];
    callback(
      null,
      `image-${req.user.id + req.user.name + "_" + req.user.lastName}.${ext}`
    );
  },
});
const isImage = (req, file, callback) => {
  
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("only images is allowed..."));
  }
};
const upload = multer({
  storage: multerConfig,
  fileFilter: isImage,
});

exports.uploadImage = upload.single("photo");
