// eslint-disable-next-line no-undef
require("dotenv").config();

import express from "express";

import collection_helper from "./src/helper/collection_helper";
import constant_helper from "./src/helper/constant_helper"; 

const app = express();

const build_path = require("path").join(__dirname, "build");
app.use(express.static(build_path));
app.listen(collection_helper.process_env_value(process.env[constant_helper.get_env_constant().REACT_APP_SERVICE_PORT]), collection_helper.process_env_value(process.env[constant_helper.get_env_constant().REACT_APP_SERVICE_HOST]));
app.get("*", (req, res) => res.sendFile(require("path").join(build_path, "./index.html")));
