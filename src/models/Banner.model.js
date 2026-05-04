import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    banner_name: {
      type: String,
      required: true,
      trim: true,
    },

    // FIX: Store images properly (array of URLs)
    images: {
      type: [String],   // <-- ARRAY of strings
      required: true,
    },

    banner_page: {
      type: String,
      default: "",      // optional field
    },
    banner_type:{
      type:String
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

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
