var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  UserID: String,
  Balance: Number,
});

UserSchema.index({ UserID: 1 }, { unique: true });

module.exports = UserSchema = mongoose.model("UserSchema", UserSchema);
