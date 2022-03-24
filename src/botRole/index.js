const https = require("https");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 80;
const TOKEN = process.env.channelAccessToken;
const cmdParse = require("../cmdPaser/paser");
const cmd = require("./cmd");
const _function = require("./function");
const res = require("express/lib/response");
const middleware = require("@line/bot-sdk").middleware;

var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

const client = new MongoClient(url);
client.connect();
const database = client.db("LineAppDB");
var betFlag = false;

database.collection("FlagTable").findOne({}, function (err, result) {
  if (err) throw err;
  if (result == null) betFlag;
  else betFlag = result.Flag;
});

/*
const config = {
  channelAccessToken: process.env.channelAccessToken, 
  channelSecret: process.env.channelSecret,
};


app.post("/webhook", middleware(config), (req, res) => {
  req.body.events; // webhook event objects
  req.body.destination; // user ID of the bot (optional)
});
*/

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  // if (cmdParse.parser(JSON.parse(req.body.events).line) !== false) {
  // console.log(cmdParse.parser(JSON.parse(req.body.events).line));
  res.send("OK");
  // }
});

app.post("/webhook", async function (req, res) {
  if (
    req.body.events[0].message.type === "text" &&
    req.body.events[0].message.text == "/start"
  ) {
    var myobj = { Flag: true };
    console.log("OK");
    var result = await database.collection("FlagTable").find({}).toArray();
    if (result[0] == undefined) {
      database.collection("FlagTable").insertOne(myobj);
    } else {
      database
        .collection("FlagTable")
        .updateOne({ Flag: false }, { $set: { Flag: true } });
    }
    res.send("OK");
  } else if (
    req.body.events[0].message.type === "text" &&
    req.body.events[0].message.text == "/end"
  ) {
    var myobj = { Flag: false };
    console.log(myobj);

    console.log(betFlag);
    database.collection("FlagTable").updateOne(
      { Flag: true },
      {
        $set: { Flag: false },
      }
    );
  } else if (
    req.body.events[0].message.type === "text" &&
    req.body.events[0].message.text == "/throw"
  ) {
    _function.createRandomDice();
  } else if (
    req.body.events[0].type === "message" &&
    req.body.events[0].message.type === "text" &&
    betFlag == true
  ) {
    if (cmdParse.parser(req.body.events[0].message.text) !== false) {
      var flag = cmdParse.parser(req.body.events[0].message.text);

      var param = {
        text: req.body.events[0].message.text,
        userID: req.body.events[0].source.userId,
        type: flag,
      };

      console.log(flag);
      if (
        flag == "large" ||
        flag == "small" ||
        flag == "odds" ||
        flag == "even" ||
        flag == "single" ||
        flag == "double"
      ) {
        cmd.cmdBet(param);
        res.send("OK");
      }

      if (flag == "normal") {
        switch (req.body.events[0].message.text) {
          case "/X":
            cmd.cmdX(param);

          case "/C":
            cmd.cmdC(param);

          case "/A":
            cmd.cmdA(param);

          case "/B":
            cmd.cmdB(param);

          case "/S":
            cmd.cmdS(param);

          case "/Y":
            cmd.cmdY(param);

          case "/N":
            cmd.cmdN(param);
        }
      }
    }
  } else if (req.body.events[0].type === "memberJoined") {
  } else {
    return false;
  }
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
