const mongoose = require("mongoose");
const uniqueString = require("unique-string");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: 0 },
    password: { type: String, required: true },
    rememberToken: { type: String, default: null },
    learning : [{ type : Schema.Types.ObjectId , ref : 'Course'}],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

userSchema.plugin(mongoosePaginate);

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

userSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "user",
});

userSchema.methods.isVip = function () {
  return true;
};

userSchema.methods.checkLearning = function (courseId) {
  return this.learning.indexOf(courseId) !== -1;
};

module.exports = mongoose.model("User", userSchema);
