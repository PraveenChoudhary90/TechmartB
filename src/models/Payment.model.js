import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: String,
      email: String,
      phone: String,
    },

    address: {
      address: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },

    products: [
      {
        id: Number,
        productId: String,

        ProductName: String,   // 👈 same as payload
        brand: String,
        category: String,
        description: String,

        qty: Number,           // 👈 same as payload
        product_mrp: Number,   // 👈 same as payload

        gst: Number,

        image: String,
        images: [String],

        attributes: [
          {
            key: String,
            values: [String],
          },
        ],
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    razorpay_order_id: String,
    razorpay_payment_id: String,

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    deliveryStatus: {
      type: String,
      enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"],
      default: "PENDING",
    },

    invoiceNo: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);


// ✅ simple unique invoice
orderSchema.pre("save", function (next) {
  if (!this.invoiceNo) {
    this.invoiceNo = "INV-" + Date.now();
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;