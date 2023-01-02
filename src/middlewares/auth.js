const config = require("config");
const jwt = require("jsonwebtoken");
const BlackList = require("../models/blacklist");
const User = require("../models/user");

async function isLoogedin(req, res, next) {
  let token = null;
  const expect_url = EXPECT__URL_ISLOGGEDIN.filter((item) => {
    const lastChar = item.url.substr(item.url.length - 2);
    const mainAddress = "/api" + item.url.substr(0, item.url.length - 2);
    const changeOriginRUrl = req.originalUrl.substr(0, mainAddress.length);
    if (
      lastChar == "/*" &&
      req.method == item.method &&
      mainAddress == changeOriginRUrl
    ) {
      return item;
    }
    return (
      ("/api" + item.url).trim() === req.originalUrl.trim() &&
      req.method == item.method
    );
  });
  if (expect_url.length === 0) {
    const headerToken = req.header("Authorization");
    if (!headerToken) return res.status(400).send("access denied");
    token = headerToken.split(" ")[1];
    const existTokenOnBlackList = await BlackList.findOne({ token });
    if (existTokenOnBlackList) res.status(400).send("access denied");
    const decodedToken = jwt.verify(token, config.get("jwt_key"));
    const user = await User.findById(decodedToken.id);
    user.imgSrc = "asset/images/users/";
    req.user = user;
  }
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

const EXPECT__URL_ISLOGGEDIN = [
  {
    url: "/product/product",
    method: "GET",
  },
  {
    url: "/product/product/*",
    method: "GET",
  },
];

module.exports = {
  isLoogedin,
  isAdmin,
};
