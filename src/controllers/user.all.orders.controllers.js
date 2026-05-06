
import productOrder from "../models/payment.model.js";

export const getAllUserOrders = async (req, res) => {
    try {
        const userId = req.user._id; // Use authenticated user's ID
        const orders = await productOrder.find({ "user.id": userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
