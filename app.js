const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./src/routes/user.routes");
const authRoutes = require("./src/routes/auth.routes");
const profileRoutes = require("./src/routes/profile.routes");
const stateRoutes = require("./src/routes/state.routes");
const cityRoutes = require("./src/routes/city.routes");

const { API_VERSION } = require("./config");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, profileRoutes);
app.use(`/api/${API_VERSION}`, stateRoutes);
app.use(`/api/${API_VERSION}`, cityRoutes);

module.exports = app;
