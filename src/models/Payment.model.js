import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    email: String,
    phone: String,
  },
    address: {
  address: String,
  city: String,
  state: String,
  country: String,
  pincode: String
},


  products: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number,
       gst: Number,
       productCode: String,
    description: String,
    combination: String,
    companyName: String,
    packSize: String,
    images: Array,
    attributes: Array,
    categories: Array,
    },
  ],
  totalAmount: Number,
  razorpay_order_id: String,
  razorpay_payment_id: String,
  paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  deliveryStatus: { type: String, enum: ["PENDING","PROCESSING","SHIPPED","DELIVERED"], default: "PENDING" },
  createdAt: { type: Date, default: Date.now },
    invoiceNo: { type: String, unique: true }, 

});



orderSchema.pre("save", function (next) {
  if (!this.invoiceNo) {
    // Generate a 6-digit random number (more than 5 digits)
    this.invoiceNo = Math.floor(100000 + Math.random() * 900000).toString();
  }
});

const Order = mongoose.model("PaymentOrderdata", orderSchema);
export default Order;
