const fs = require("fs");

async function images(req, res, next) {
  const folders = fs.readdirSync("./public/asset/images");
  const images = [];
  folders.forEach((folder) => {
    const obj = {};
    const files = fs.readdirSync("./public/asset/images/" + folder);
    obj.folder = folder;
    obj.files = files;
    images.push(obj);
  });
  req.images = images;
  next();
}

module.exports = {
  images,
};
