require("dotenv").config();
const cmdParse = require("./cmdPaser/paser");
const cmd = require("./botRole/cmd");
const line = require("@line/bot-sdk");
const _function = require("./botRole/function");
var UserTable = require("./model/UserSchema");

const fs = require("fs");
var express = require("express");

var Router = express.Router();
var FlagTable = require("./model/FlagSchema");

const config = {
  channelAccessToken: process.env.CHANNELACCESSTOKEN,
  channelSecret: process.env.CHANNELSECRET,
};

const client = new line.Client({
  channelAccessToken: config.channelAccessToken,
});

var betFlag = false;

const setFlag = async () => {
  const flag = await FlagTable.find({});
  if (flag[0]) betFlag = flag[0].Flag;
};

setFlag();

const writeLog = (text) => {
  fs.appendFileSync(
    __dirname + "/reponse.log",
    JSON.stringify(text, null, "\t") + "\r\n\r\n\r\n"
  );
};

const sendMessage = (replyToken, text) => {
  const message = {
    type: "text",
    text: text,
  };

  client
    .replyMessage(replyToken, message)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const isAdmin = (userid) => {
  return userid === "U1525cfda31a82e8d870f227fccfd3a43";
};

Router.route("/webhook").post(async function (req, res) {
  if (req.body.events && req.body.events.length !== 0) {
    await setFlag();
    writeLog(req.body);
    const event = req.body.events[0];
    const { message, source } = event;
    handleWebHook(event, source, message);
  }
  res.send("OK");
});

const handleWebHook = async (event, source, message) => {
  try {
    // sendMessage(event.replyToken, "okay");
    if (message.type === "text") {
      if (message.text == "/start" && isAdmin(source.userId)) {
        var saveData = new FlagTable({
          Flag: true,
        });
        var result = await FlagTable.find({});
        if (result[0] == undefined) {
          await saveData.save();
        } else {
          await FlagTable.updateOne({ Flag: false }, { $set: { Flag: true } });
        }
        sendMessage(event.replyToken, "Betting Started");
      } else if (message.text == "/end" && isAdmin(source.userId)) {
        await FlagTable.updateOne(
          { Flag: true },
          {
            $set: { Flag: false },
          }
        );
        sendMessage(event.replyToken, "End betting");
      } else if (message.text == "/throw" && isAdmin(source.userId)) {
        _function.createRandomDice();
      } else if (event.type === "message" && betFlag == true) {
        if (cmdParse.parser(message.text) !== false) {
          var flag = cmdParse.parser(message.text);
          var param = {
            text: message.text,
            userID: event.source.userId,
            type: flag,
          };
          if (
            flag == "large" ||
            flag == "small" ||
            flag == "odds" ||
            flag == "even" ||
            flag == "single" ||
            flag == "double"
          ) {
            sendMessage(
              event.replyToken,
              event.source.userId + "User Bets with " + message.text
            );
            cmd.cmdBet(param);
          }

          if (flag == "normal") {
            var result = "";
            if (message.text.includes("/Y")) {
              result = cmd.cmdY(param);
              sendMessage(
                event.replyToken,
                event.source.userId + "User was set Bank account to " + result
              );
            }

            if (message.text.includes("/S")) {
              result = cmd.cmdS(message.text[" "][1]);
              sendMessage(
                event.replyToken,
                event.source.userId + "User was set Bank account to " + result
              );
            }

            switch (message.text) {
              case "/X":
                cmd.cmdX(param);
                sendMessage(
                  event.replyToken,
                  event.source.userId + "user has canceled the bet."
                );
                break;

              case "/C":
                var result = 0;
                cmd.cmdC(param).then((res) => {
                  result = res;
                });
                sendMessage(
                  event.replyToken,
                  event.source.userId + "user's balance is" + result
                );
                break;

              case "/A":
                var result = cmd.cmdA(param);
                sendMessage(event.replyToken, result);
                break;

              case "/B":
                cmd.cmdB(param).then((res) => {
                  sendMessage(
                    event.replyToken,
                    event.source.userId +
                      "user has canceled the bet and balance is " +
                      res
                  );
                });
                break;

              case "/N":
                result = cmd.cmdN(param);
                sendMessage(
                  event.replyToken,
                  event.source.userId + "user's bets history" + result
                );
            }
            console.log(result);
          }
        }
      } else if (event.type === "memberJoined") {
        var serachUser = await UserTable.findOne({ UserID: source.userId });
        if (serachUser) {
          return;
        } else {
          var obj = new UserTable({
            UserID: source.userId,
            Balance: 600,
          });
          await obj.save();
        }
      } else {
        // return false;
      }
    }
  } catch (error) {}
};

module.exports = Router;
