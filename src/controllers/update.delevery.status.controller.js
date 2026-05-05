
import PaymentorderModel from "../models/payment.model.js";




export const updateDeliveryStatusByAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newStatus } = req.body;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Valid orderId is required" });
    }

    if (!newStatus) {
      return res.status(400).json({ message: "newStatus is required" });
    }

    const order = await PaymentorderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const currentStatus = order.deliveryStatus || "PENDING";

    // Allowed transitions
    // const ALLOWED_TRANSITIONS = {
    //   PENDING: ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"],
    //   PROCESSING: ["SHIPPED", "DELIVERED", "CANCELED"],
    //   SHIPPED: ["DELIVERED", "CANCELED"],
    //   DELIVERED: [],
    //   CANCELED: [],
    // };

    // if (!ALLOWED_TRANSITIONS[currentStatus]?.includes(newStatus)) {
    //   return res.status(400).json({
    //     message: `Cannot change delivery status from ${currentStatus} to ${newStatus}`,
    //   });
    // }

    order.deliveryStatus = newStatus;
    await order.save();

    return res.json({
      success: true,
      message: "Delivery status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating delivery status:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};