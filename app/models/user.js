const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    isAdmin: { type: Boolean, default: 0 },
    password: { type: String, require: true },
  },
  { timestamps: true }
);


module.exports = mongoose.model('User', userSchema)