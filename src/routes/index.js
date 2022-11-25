require("express-async-errors");
const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const userRouter = require("./user");
const adminRouter = require("./admin");
const productRouter = require("./product");
const error = require("../middlewares/error");
const { isLoogedin, isAdmin } = require("../middlewares/auth");
router.use("/auth", authRouter);
router.use("/user", isLoogedin, userRouter);
router.use("/product", isLoogedin, productRouter);
router.use("/admin", isAdmin, adminRouter);
router.use(error);

module.exports = router;
