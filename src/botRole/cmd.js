var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

//Process the balance in game
const handleBalance = () => {};

//Cancel the bet
const cmdX = (param) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("LineAppDB");
    var myobj = { userID: param.userID };
    dbo.collection("FlagTable").find(myobj).remove();
  });
};

//Check balance
const cmdC = () => {
  var balance = 0;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    balance = db.bios.findOne([]);
    db.close();
  });
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
  await MongoClient.connect(url, function (err, db) {
    var Amount = param.betType.includes("/")
      ? param.betType.split("/")[1]
      : param.betType.split("=")[1];
    if (err) throw err;
    var dbo = db.db("LineAppDB");
    var myobj = {
      betType: param.text,
      betAmount: Amount,
      betResult: "None",
      userID: param.userID,
    };

    dbo.collection("BetTable").insertOne(myobj, function (err, res) {
      if (err) throw err;
      db.close();
    });
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
