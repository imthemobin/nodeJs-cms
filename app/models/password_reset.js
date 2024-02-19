const mongoose = require("mongoose");
const uniqueString = require("unique-string");

const passwordReset = mongoose.Schema(
  {
    email: { type: String, require: true },
    token: { type: String, require: true },
    use: { type: Boolean, default: false },
  },
  { timestamps: { updatedAt: false } }
);

module.exports = mongoose.model("PasswordReset", passwordReset);
