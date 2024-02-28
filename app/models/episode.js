const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const episodeSchema = Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    title: { type: String, required: true },
    type: { type: String, required: true },
    body: { type: String, required: true },
    videoUrl: { type: String, required: true },
    time: { type: String, default: "00:00:00" },
    number: { type: Number, required: true },
    viewCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

episodeSchema.plugin(mongoosePaginate);

episodeSchema.methods.typeToPersion = function () {
  switch (this.type) {
    case "cash":
      return "نقدی";
    case "vip":
      return "اعضای ویژه";
    default:
      return "رایگان";
  }
};

episodeSchema.methods.path = function () {
  return `${this.course.slug}/${this.number}`;
};

episodeSchema.methods.download = function (check, canUserUse) {
  if (!check) return "#";

  let status = false;

  switch (this.type) {
    case "free":
      status = true;
      break;
    case "vip":
      status = canUserUse;
      break;
    case "cash":
      status = canUserUse;
      break;
  }

  let timestamps = new Date().getTime() + 3600 * 1000 * 6;

  // unique text for download
  let text = `QW7F!@#!@3!@!@U8&*^#%TF${this._id}${timestamps}`;

  let hash = bcrypt.hashSync(text, 15);

  return status ? `/download/${this._id}?mac=${hash}&t=${timestamps}` : "#";
};

// to increment number of download count
episodeSchema.methods.inc = async function (field, num = 1) {
  this[field] += num;
  await this.save();
};

module.exports = mongoose.model("Episode", episodeSchema);
