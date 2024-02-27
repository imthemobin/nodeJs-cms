const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

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

episodeSchema.plugin(mongoosePaginate)

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

episodeSchema.methods.download = function(){
  return "#"
}

module.exports = mongoose.model("Episode", episodeSchema);
