var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

const client = new MongoClient(url);
client.connect();
const database = client.db("LineAppDB");

//Cancel the bet
const cmdX = (param) => {
  var myobj = { userID: param.userID };
  database.collection("FlagTable").find(myobj).remove();
};

//Check balance
const cmdC = () => {
  var balance = 0;
  balance = db.bios.findOne([]);
  return balance;
};

//Check the rules of the game
const cmdA = () => {};

//Check the rules of the game
const cmdB = () => {};

//Stop betting and count the betting amount
const cmdS = () => {};

//Bank account number
const cmdY = () => {};

//Past lottery records
const cmdN = () => {};

//LargeBet
const cmdBet = async (param) => {
  var Amount = param.text.includes("/")
    ? param.text.split("/")[1]
    : param.text.split("=")[1];
  var myobj = {
    betType: param.text,
    betAmount: Amount,
    betResult: "None",
    userID: param.userID,
  };

  var serachData = await database
    .collection("BetTable")
    .findOne({ userID: param.userID });

  if (serachData == null) database.collection("BetTable").insertOne(myobj);
  else {
    return;
  }
};

module.exports = {
  cmdX,
  cmdC,
  cmdA,
  cmdB,
  cmdS,
  cmdY,
  cmdN,
  cmdBet,
};
