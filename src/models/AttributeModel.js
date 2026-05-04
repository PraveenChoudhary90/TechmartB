
import mongoose from "mongoose";

const AttributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    parentAttribute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attribute",
      default: null,
    },
    children: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attribute" }],
      default: [],
    },
    isDeleted: {
  type: Boolean,
  default: false
},
deletedAt: {
  type: Date,
  default: null
}
  },
  { timestamps: true }
);


AttributeSchema.index({ name: 1, parentAttribute: 1 }, { unique: true });

const Attribute = mongoose.model("Attribute", AttributeSchema);
export default Attribute;
