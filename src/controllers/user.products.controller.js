

import Product from "../models/product.model.js";


export const getAllUserProducts  =async(req, res) => {
  try {
    const products = await Product.find({ isDeleted: false })
      .populate("product_category")

    return res.json({
      success: true,
      count: products.length,
      products,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};