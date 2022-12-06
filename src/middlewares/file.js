const multer = require("multer");
const multerConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, setDestination(req));
  },
  filename: (req, file, callback) => {
    callback(null, setImageName(req, file));
  },
});
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("only images is allowed..."));
  }
};

const setImageName = (req, file) => {
  let name;
  const ext = file.mimetype.split("/")[1];
  switch (req.originalUrl) {
    case "/api/product/upload-product-image":
      name = `product-${Date.now()}.${ext}`;
      break;
    case "/api/user/upload-image":
      name = `image-${
        req.user.id + req.user.name + "_" + req.user.lastName
      }.${ext}`;
      break;
    default:
      break;
  }
  req.productName = name;
  return name;
};

const setDestination = (req) => {
  let dest;
  switch (req.originalUrl) {
    case "/api/product/upload-product-image":
      dest = "public/asset/images/products";
      break;
    case "/api/user/upload-image":
      dest = "public/asset/images/users";
      break;
    default:
      break;
  }
  req.productImagePath = dest;
  return dest;
};

const upload = multer({
  storage: multerConfig,
  fileFilter: isImage,
});

exports.uploadImage = upload.single("photo");
