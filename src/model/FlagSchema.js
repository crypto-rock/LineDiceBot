var mongoose = require("mongoose");

var FlagSchema = new mongoose.Schema({
  Flag: Boolean,
});

module.exports = FlagSchema = mongoose.model("FlagSchema", FlagSchema);
