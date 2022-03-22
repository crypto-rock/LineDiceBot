var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

const client = new MongoClient(url);
client.connect();
const database = client.db("LineAppDBintro");

//Cancel the bet
const cmdX = (param) => {
  var myobj = { userID: param.userID };
  database.collection("FlagTable").find(myobj).remove();
};

//Check balance
const cmdC = () => {
  var balance = 0;
  balance = db.bios.findOne([]);
  db.close();
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
  var Amount = param.betType.includes("/")
    ? param.betType.split("/")[1]
    : param.betType.split("=")[1];
  if (err) throw err;
  var myobj = {
    betType: param.text,
    betAmount: Amount,
    betResult: "None",
    userID: param.userID,
  };

  database.collection("BetTable").insertOne(myobj, function (err, res) {
    if (err) throw err;
    client.close();
  });
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
