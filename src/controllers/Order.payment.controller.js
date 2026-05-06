// controllers/order.payment.controller.js

import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/payment.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ==============================
// 1. CREATE RAZORPAY ORDER
// ==============================
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, totalAmount, user, address, products } = req.body;

    const paymentAmount = amount || totalAmount;
    if (!paymentAmount || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount required",
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: paymentAmount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    const orderPayload = {
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
      },
      address: {
        address: address?.address || `${address?.addressLine1 || ""} ${address?.addressLine2 || ""}`.trim(),
        city: address?.city,
        state: address?.state,
        country: address?.country,
        pincode: address?.pincode || address?.zipCode,
      },
      products: mapProducts(products || []),
      totalAmount: totalAmount || amount || 0,
      razorpay_order_id: razorpayOrder.id,
      paymentStatus: "pending",
    };

    await Order.create(orderPayload);

    res.json({
      success: true,
      order: razorpayOrder,
      razorpayOrderId: razorpayOrder.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create payment order" });
  }
};


// ==============================
// PRODUCT MAPPER (simple)
// ==============================
const mapProducts = (items) => {
  return items.map((item) => ({
    productId: item.productId,
    name: item.ProductName || item.name,
    quantity: item.qty || 1,
    price: item.product_mrp || item.price,

    image: item.image,
    brand: item.brand,
    category: item.category,
  }));
};


// ==============================
// 2. VERIFY PAYMENT + SAVE ORDER
// ==============================
export const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user,
      address,
      products,
      totalAmount,
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { razorpay_order_id },
      { paymentStatus: "paid", razorpay_payment_id },
      { new: true }
    );

    if (!updatedOrder) {
      const fallbackOrder = {
        user: {
          id: user?.id,
          name: user?.name,
          email: user?.email,
          phone: user?.phone,
        },
        address: {
          address: address?.address || `${address?.addressLine1 || ""} ${address?.addressLine2 || ""}`.trim(),
          city: address?.city,
          state: address?.state,
          country: address?.country,
          pincode: address?.pincode || address?.zipCode,
        },
        products: mapProducts(products || []),
        totalAmount: totalAmount || 0,
        razorpay_order_id,
        razorpay_payment_id,
        paymentStatus: "paid",
      };
      await Order.create(fallbackOrder);
    }

    res.json({ success: true, message: "Payment verified and order saved" });
  } catch (error) {
    console.error("PaymentMode Error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};