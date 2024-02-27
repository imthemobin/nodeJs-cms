const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const commentSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    parent: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    approved: { type: Boolean, default: false },
    course: { type: Schema.Types.ObjectId, ref: "Course", default: undefined },
    episode: {
      type: Schema.Types.ObjectId,
      ref: "Episode",
      default: undefined,
    },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

commentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Comment", commentSchema);
