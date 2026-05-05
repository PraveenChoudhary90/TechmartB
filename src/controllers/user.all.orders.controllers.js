
import productOrder from "../models/payment.model.js";

export const getAllUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await productOrder.find({ userId });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
