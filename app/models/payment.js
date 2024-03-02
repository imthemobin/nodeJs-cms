const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const paymentSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User",},
    course: { type: Schema.Types.ObjectId, ref: "Course", default: null },
    vip: {type: Boolean, default:false},
    ressNumber: {type: String, required:true},
    price: { type: Number, required: true},
    payment: { type: Boolean, default: false},
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

paymentSchema.plugin(mongoosePaginate);

paymentSchema.virtual('childs', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

module.exports = mongoose.model("Payment", paymentSchema);
