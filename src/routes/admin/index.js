const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.get("/dashboard", controller.dashboard.bind(controller));
module.exports = router;
