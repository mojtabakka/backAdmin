const config = require("config");
const jwt = require("jsonwebtoken");
const BlackList = require("../models/blacklist");
const User = require("../models/user");

async function isLoogedin(req, res, next) {
  const headerToken = req.header("Authorization");
  token = headerToken.split(" ")[1];
  const existTokenOnBlackList = await BlackList.findOne({ token });
  if (existTokenOnBlackList || !token) res.staus(400).send("access denied");
  const decodedToken = jwt.verify(token, config.get("jwt_key"));
  const user = await User.findById(decodedToken.id);
  req.user = user;
  next();
  try {
  } catch (ex) {
    res.staus(400).send("ivalid token");
  }
}

async function isAdmin(req, res, next) {
  if (!req.user.isAdmin) {
    res.staus(403).send("access denied");
  }
}

module.exports = {
  isLoogedin,
  isAdmin,
};
