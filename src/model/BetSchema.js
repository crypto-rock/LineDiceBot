var mongoose = require("mongoose");

var BetSchema = new mongoose.Schema({
  betID: Number,
  betType: String,
  betPayoff: String,
  betResult: String,
  betDice: Array,
  UserID: String,
  bankAccount: Number,
});

BetSchema.index({ betID: 1 }, { unique: false });

module.exports = BetSchema = mongoose.model("BetSchema", BetSchema);
