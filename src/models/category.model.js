// import mongoose from "mongoose";

// const categorySchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   image: { type: String },
// }, { timestamps: true });

// const Category = mongoose.model("Category", categorySchema);
// export default Category;

import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String, 
            required: true,
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

const Category = mongoose.model("Category", categorySchema);
export default Category;
