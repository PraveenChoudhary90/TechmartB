import Cart from "../models/Cart.model.js";
import Product from "../models/ProductModel.js";


export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, qty: bodyQty } = req.body;
    const userId = req.user._id;

    // Accept both 'quantity' and 'qty' field names
    const qty = Number(quantity || bodyQty);

    if (!productId || isNaN(qty) || qty <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid productId or quantity",
      });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ productId, quantity: qty }],
      });
    } else {
      const index = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (index > -1) {
        // Set exact quantity, don't add
        cart.items[index].quantity = qty;
      } else {
        cart.items.push({ productId, quantity: qty });
      }
    }

    await cart.save();
    const populatedCart = await cart.populate("items.productId");

    res.json({
      success: true,
      message: "Product added to cart successfully",
      cart: populatedCart,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId })
      .populate("items.productId");

    if (!cart) {
      return res.json({
        success: true,
        message: "Cart is empty",
        cart: { user: userId, items: [] },
      });
    }

    res.json({
      success: true,
      cart,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID required",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    const populatedCart = await cart.populate("items.productId");

    res.json({
      success: true,
      message: "Product removed from cart",
      cart: populatedCart,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const qty = Number(quantity);

    if (!productId || isNaN(qty) || qty < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid productId or quantity",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const index = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    if (qty === 0) {
      cart.items.splice(index, 1);
    } else {
      cart.items[index].quantity = qty;
    }

    await cart.save();
    const populatedCart = await cart.populate("items.productId");

    res.json({
      success: true,
      message: "Cart updated successfully",
      cart: populatedCart,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [] }
    );

    res.json({
      success: true,
      message: "Cart cleared successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};





export const checkout = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId })
      .populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart empty",
      });
    }

    let total = 0;
    let orderItems = [];

    for (let item of cart.items) {
      const product = item.productId;

      if (!product) continue; // 🔥 safety

      const price =
        Number(product.product_mrp) -
        (Number(product.product_mrp) *
          Number(product.discount_percentage || 0)) / 100;

      total += price * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.title,
        quantity: item.quantity,
        price,
      });
    }

    res.json({
      success: true,
      orderItems,
      totalAmount: total,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};