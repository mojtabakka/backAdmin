const express = require("express");
const app = express();
const router = require("./src/routes");
const dotenv = require("dotenv");
const { PORT } = require("./config/variables");

require("./src/startdup/logging")();
require("./src/startdup/db")();
require("./src/startdup/config")(express, app);
app.use("/api", router);

const port = PORT || 3002;
app.listen(port, () => console.log(`you are listening port ${port}`));
