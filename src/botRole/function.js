var BetTable = require("../model/BetSchema");
var UserTable = require("../model/UserSchema");
const cmdParse = require("../cmdPaser/paser");

//Manage the balance
const manageBalance = (param) => {
  if (param.result == "Win") {
    UserTable.updateOne(
      { UserID: param.userID },
      {
        $inc: {
          UserID: param.userID,
          Balance: param.Amount,
        },
      }
    );
  } else {
    UserTable.updateOne(
      { UserID: param.userID },
      {
        $inc: {
          UserID: param.userID,
          Balance: -param.Amount,
        },
      }
    );
  }
};

//Seperate the double num
const seperateNum = (num) => {
  var arr = [];
  while (num != 0) {
    arr.push(num % 10);
    num = (num - (num % 10)) / 10;
  }
  return arr;
};

//Generates 3 pictures of dif ferent numbers of dice
const createRandomDice = async () => {
  var num = Math.floor(Math.random() * (666 - 0) + 0);
  var arr = [];
  arr = seperateNum(num);

  var result = await BetTable.find({});
  var len = await BetTable.findOne().sort("-betID");

  if (result[0] != null) {
    var length = 0;
    if (len == null) length;
    else length = len.betID;

    result.map(async (element, index) => {
      var sum = 0;
      var result = "";

      var Amount = element.betType.includes("/")
        ? element.betType.split("/")[1]
        : element.betType.split("=")[1];

      var num = element.betType.includes("/")
        ? element.betType.split("/")[0]
        : element.betType.split("=")[0];

      var type = cmdParse.parser(element.betType);

      if (type == "large") {
        for (var i = 0; i < arr.length; i++) {
          sum += arr[i];
        }

        if (sum > 11) {
          Amount = Amount * 2;
          result = "Win";
        } else {
          Amount = 0;
          result = "Lost";
        }

        await BetTable.updateOne(
          { UserID: element.UserID },
          {
            $set: {
              betPayoff: Amount,
              betDice: arr,
              betResult: result,
            },
          }
        );
      }

      if (type == "small") {
        for (var i = 0; i < arr.length; i++) {
          sum += arr[i];
        }

        if (sum < 11) {
          Amount = Amount * 2;
          result = "Win";
        } else {
          Amount = 0;
          result = "Lost";
        }

        await BetTable.updateOne(
          { UserID: element.UserID },
          {
            $set: {
              betPayoff: Amount,
              betDice: arr,
              betResult: result,
            },
          }
        );
      }

      if (type == "odds") {
        var count = 0;
        arr.forEach((element) => {
          if (element % 2 == 0) count++;
        });
        if (count > 0) {
          Amount = Amount * (count + 1);
          result = "Win";
        } else {
          Amount = 0;
          result = "Lost";
        }
        await BetTable.updateOne(
          { UserID: element.UserID },
          {
            $set: {
              betPayoff: Amount,
              betDice: arr,
              betResult: result,
            },
          }
        );
      }

      if (type == "even") {
        var count = 0;
        arr.forEach((element) => {
          if (element % 2 == 1) count++;
        });
        if (count > 0) {
          Amount = Amount * (count + 1);
          result = "Win";
        } else {
          Amount = 0;
          result = "Lost";
        }
        await BetTable.updateOne(
          { UserID: element.UserID },
          {
            $set: {
              betPayoff: Amount,
              betDice: arr,
              betResult: result,
            },
          }
        );
      }

      if (type == "single") {
        var count = 0;
        arr.forEach((element) => {
          console.log(parseInt(element), parseInt(num));
          if (parseInt(element) == parseInt(num)) count++;
        });
        if (count > 0) {
          Amount = Amount * 6;
          console.log("Win");
          result = "Win";
        } else {
          Amount = 0;
          result = "Lost";
        }
        await BetTable.updateOne(
          { UserID: element.UserID },
          {
            $set: {
              betPayoff: Amount,
              betDice: arr,
              betResult: result,
            },
          }
        );
      }

      if (type == "double") {
        var count = 0;
        var compareNum = seperateNum(parseInt(num));
        compareNum.forEach((comNum) => {
          if (arr.includes(comNum)) count++;
        });

        if (count > 1) {
          Amount = Amount * 6;
          result = "Win";
        } else {
          Amount = 0;
          result = "Lost";
        }

        await BetTable.updateOne(
          { UserID: element.UserID },
          {
            $set: {
              betPayoff: Amount,
              betDice: arr,
              betResult: result,
            },
          }
        );
      }

      var Amount_1 = element.betType.includes("/")
        ? element.betType.split("/")[1]
        : element.betType.split("=")[1];

      var fectData = {
        result: result,
        UserID: element.UserID,
        Amount: result == "Win" ? Amount : Amount_1,
      };

      manageBalance(fectData);
    });

    return arr;
  }
};

module.exports = {
  createRandomDice,
};
