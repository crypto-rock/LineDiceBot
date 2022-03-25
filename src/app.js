require("dotenv").config();
const https = require("https");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 80;
const TOKEN = process.env.channelAccessToken;
const cmdParse = require("./cmdPaser/paser");
const cmd = require("./botRole/cmd");
const _function = require("./botRole/function");
const middleware = require("@line/bot-sdk").middleware;
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var url = "mongodb://localhost:27017/LineAppDB";
var cors = require("cors");

mongoose
  .connect(url)
  .then(() => {
    console.log("Start");
  })
  .catch((err) => {
    console.error("App starting error:", err.stack);
    process.exit(1);
  });

// Required aplication specific custom router module
var Router = require("./index.js");

// Use middlewares to set view engine and post json data to the server

app.use(cors());
if (process.env.MODE === "development") {
  app.use(bodyParser.json());
}

app.use("", Router);

app.get("/", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
