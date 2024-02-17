const mongoose = require("mongoose");
const uniqueString = require("unique-string");

const userSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    isAdmin: { type: Boolean, default: 0 },
    password: { type: String, require: true },
    rememberToken: { type: String, default: null },
  },
  { timestamps: true }
);

userSchema.methods.setRememberToken = async function (res) {
  try {
    const token = uniqueString();
    res.cookie("remember_token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      signed: true,
    });
    this.rememberToken = token;
    await this.save();
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoose.model("User", userSchema);
