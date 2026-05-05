import OrderModel from "../models/payment.model.js";

export  const   AdminOrderDetails = async (req, res) => {
  try {
    const Orders = await OrderModel.find(); 
    res.json(Orders);
  } catch (err) {
    console.error("Error fetching orders:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

