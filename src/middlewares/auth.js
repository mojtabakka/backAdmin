const config = require("config");
const jwt = require("jsonwebtoken");
const BlackList = require("../models/blacklist");
const User = require("../models/user");

async function isLoogedin(req, res, next) {
  const expect_url = EXPECT__URL_ISLOGGEDIN.filter((item) => {
    return "/api" + item.url === req.originalUrl && req.method == item.method;
  });
  const headerToken = req.header("Authorization");
  token = headerToken.split(" ")[1];
  const existTokenOnBlackList = await BlackList.findOne({ token });
  if (existTokenOnBlackList || (!token && expect_url.length === 0))
    res.status(400).send("access denied");
  const decodedToken = jwt.verify(token, config.get("jwt_key"));
  const user = await User.findById(decodedToken.id);
  user.imgSrc = "asset/images/users/";
  console.log(user);
  req.user = user;
  next();
  try {
  } catch (ex) {
    res.status(400).send("ivalid token");
  }
}

async function isAdmin(req, res, next) {
  if (!req.user.isAdmin) {
    res.status(403).send("access denied");
  }
}

const EXPECT__URL_ISLOGGEDIN = [];

module.exports = {
  isLoogedin,
  isAdmin,
};
