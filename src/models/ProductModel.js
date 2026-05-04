import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    product_category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    
    attributes: [
      {
        attribute: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Attribute",
          required: true,
        },
        values: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    ],

    ProductName: {
      type: String,
      default: "",
      trim: true,
    },

    

    // pack_size: {
    //   type: String,
    //   default: "",
    //   trim: true,
    // },

    // stock: {
    //   type: Number,
    //   required: true,
    //   min: 0,
    // },

    // originalStock: {
    //   type: Number,
    //   default: 0,
    // },

    

    gst_in_percentage: {
      type: Number,
      default: 0,
      min: 0,
    },

    product_mrp: {
      type: Number,
      required: [true, "product_mrp is required"],
      min: 0,
    },

    // franchisee_price: {
    //   type: Number,
    //   default: 0,
    //   min: 0,
    // },

     Brand:{
      type:String
     },

    detail_description: {
      type: String,
      default: "",
      trim: true,
    },

   images: [
  {
    url: { type: String, required: true },
    fileId: { type: String, required: true },
  },
],

isFeatured: {
  type: Boolean,
  default: false, // by default product featured nahi hai
},

isOnSale: {
  type: Boolean,
  default: false, // by default product on sale nahi hai
},

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
     discount_percentage: {
      type: Number,
      default: 0, // 0% by default
      min: 0,
    },
    
  },
  { timestamps: true }
);


ProductSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
});

ProductSchema.pre("save", async function (next) {
  if (!this.productId) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let id;
    let exists = true;

    // 🔥 ensure unique ID
    while (exists) {
      id = "";
      for (let i = 0; i < 7; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const existing = await mongoose.models.Product.findOne({ productId: id });
      if (!existing) {
        exists = false;
      }
    }

    this.productId = id;
  }
});


const Product = mongoose.model("Product", ProductSchema);
export default Product;
