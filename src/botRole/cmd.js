var BetTable = require("../model/BetSchema");
var FlagTable = require("../model/FlagSchema");
var UserTable = require("../model/UserSchema");

const isAdmin = (userid) => {
  return userid === "U1525cfda31a82e8d870f227fccfd3a43";
};

//Cancel the bet
const cmdX = async (param) => {
  if (!isAdmin(param.userID)) {
    var myobj = { UserID: param.userID };
    var exiting = await BetTable.findOne({ UserID: param.userID });
    if (exiting) await BetTable.deleteOne(myobj);
    return;
  }
};

//Check balance
const cmdC = async (param) => {
  var data = await UserTable.findOne({ UserID: param.userID });
  if (data) return data.Balance;
};

//Check the rules of the game
const cmdA = () => {
  var rule = `1 single type: 
  Small: 
    The total points are 4-10 (Leopard Banker takes all) 
  Big: 11-17 total points (Leopard Banker takes all) 
  Single: The total number of points is 5.7.9.11.13.15.17 points 
  Double: 4.6.8.10.12.14.16 points total Multiple: 
2 times 
2.Duplex Big single, big double, small single, small double, digital size, digital single and double. 
  Odds: 3.3x
3 Double digits 1/2 3/1 Odds: 6x 4. 
  Single Number Offer a 2x odds 2 out of 3 odds 3 out of 4 odds`;
  return rule;
};

//Stop betting and count the betting amount
const cmdB = async (param) => {
  var myobj = { UserID: param.userID };
  if (!isAdmin(param.userID)) {
    var exiting = await BetTable.findOne(myobj);
    if (exiting) await BetTable.deleteOne(myobj);
  }
  var data = await UserTable.findOne(myobj);
  if (data) return data.balance;
};

//Enter the lottery result, the robot will display the picture
const cmdS = async (param) => {
  var Amount = param.text.includes("/")
    ? param.text.split("/")[1]
    : param.text.split("=")[1];
  var result = await BetTable.find({
    $and: [{ UserID: param.userID }, { betPayoff: parseInt(Amount) }],
  });
  return result.betDice;
};

//Bank account number
const cmdY = async (param) => {
  var bankNum = param.text.split(" ")[1];
  if (bankNum != "") {
    var oldUser = await BetTable.findOne({ UserID: param.userID });

    await BetTable.updateOne(
      { UserID: param.userID },
      {
        $set: {
          betID: oldUser.betID,
          betType: oldUser.betType,
          betPayoff: oldUser.betPayoff,
          betResult: oldUser.betResult,
          betDice: oldUser.betDice,
          UserID: oldUser.UserID,
          bankAccount: parseInt(bankNum),
        },
      }
    );
  }
};

//Past lottery records
const cmdN = async (param) => {
  var len = await BetTable.findOne().sort("-betID");
  var data = await BetTable.find();
  var result = [];
  for (var i = len; i >= len - 10; i--) {
    result.push(data[i]);
  }
  return result;
};

//LargeBet
const cmdBet = async (param) => {
  var len = await BetTable.findOne().sort("-betID");
  var length = 0;
  if (len == null) length;
  else length = len.betID;
  console.log(length);
  var Amount = param.text.includes("/")
    ? param.text.split("/")[1]
    : param.text.split("=")[1];
  var myobj = new BetTable({
    betID: parseInt(length + 1),
    betType: param.text,
    betPayoff: 0,
    betDice: [],
    betResult: "None",
    UserID: param.userID,
    bankAccount: 0,
  });

  var serachUser = await BetTable.findOne({ UserID: param.userID });

  if (serachUser == null) myobj.save();
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
