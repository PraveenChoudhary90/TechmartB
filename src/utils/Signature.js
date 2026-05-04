import crypto from "crypto";

const razorpay_order_id = "order_SlIBH25f9rYC1a";
const razorpay_payment_id = "pay_test123";

const secret = process.env.RAZORPAY_KEY_SECRET;

const signature = crypto
  .createHmac("sha256", secret)
  .update(razorpay_order_id + "|" + razorpay_payment_id)
  .digest("hex");

console.log("SIGNATURE:", signature);