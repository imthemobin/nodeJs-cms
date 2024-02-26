const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const CourseSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    type: { type: String, required: true },
    body: { type: String, required: true },
    price: { type: String, required: true },
    images: { type: Object, required: true },
    tumb: { type: String, required: true },
    tags: { type: String, required: true },
    time: { type: String, default: "00:00:00" },
    viewCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CourseSchema.plugin(mongoosePaginate)

CourseSchema.methods.typeToPersion = function () {
  switch (this.type) {
    case "cash":
      return "نقدی";
    case "vip":
      return "اعضای ویژه";
    default:
      return "رایگان";
  }
};

CourseSchema.virtual('episodes',{
  ref:'Episode',
  localField: '_id',
  foreignField: 'course'
})

module.exports = mongoose.model("Course", CourseSchema);
