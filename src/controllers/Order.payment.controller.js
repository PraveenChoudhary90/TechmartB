// controllers/PaymentController.js

import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import Order from "../models/Payment.model.js";

dotenv.config();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ==============================
// 1. CREATE RAZORPAY ORDER (NO DB ORDER YET)
// ==============================
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount required",
      });
    }

    const options = {
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    if (!razorpayOrder) {
      return res.status(500).json({
        success: false,
        message: "Failed to create Razorpay order",
      });
    }

    res.json({
      success: true,
      razorpayOrder,
    });

  } catch (error) {
    console.error("createRazorpayOrder Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==============================
// 2. VERIFY PAYMENT + CREATE ORDER
// ==============================
export const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      address,
      products,
      totalAmount,
    } = req.body;

    const userId = req.user._id; // ✅ secure user

    // ----------------------------
    // 1. Validate input
    // ----------------------------
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment details missing",
      });
    }

    // ----------------------------
    // 2. Verify Signature
    // ----------------------------
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // ----------------------------
    // 3. CREATE ORDER (AFTER PAYMENT SUCCESS)
    // ----------------------------
    const newOrder = await Order.create({
      user: userId,

      address,

      products: products.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.qty,
        price: item.price,
        gst: item.gst || 0,
        images: item.images || [],
        attributes: item.attributes || {},
        categories: item.categories || [],
      })),

      totalAmount,

      razorpay_order_id,
      razorpay_payment_id,

      paymentStatus: "paid",
      deliveryStatus: "PENDING",
    });

    res.json({
      success: true,
      message: "Payment verified & order created",
      order: newOrder,
    });

  } catch (error) {
    console.error("verifyPayment Error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};