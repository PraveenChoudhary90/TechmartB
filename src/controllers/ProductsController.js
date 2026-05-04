import Product from "../../src/models/ProductModel.js";
import imagekit from "../../src/utils/imagekit.js";


// ======================================
// 🔥 CREATE PRODUCT
// ======================================
export const addProduct = async (req, res) => {
  try {
    let {
      product_category,
      attributes,
      ProductName,
      gst_in_percentage,
      product_mrp,
      Brand,
      detail_description,
      isFeatured,
      isOnSale,
      discount_percentage,
      images
    } = req.body;

    // parse attributes
    if (typeof attributes === "string") {
      attributes = JSON.parse(attributes);
    }

    let uploadedImages = [];

    // BASE64 images
    if (images && Array.isArray(images)) {
      for (let img of images) {
        const uploaded = await imagekit.upload({
          file: img,
          fileName: "product.jpg",
          folder: "/products",
        });

        uploadedImages.push({
          url: uploaded.url,
          fileId: uploaded.fileId,
        });
      }
    }

    // FORM-DATA images
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const base64 = file.buffer.toString("base64");

        const uploaded = await imagekit.upload({
          file: base64,
          fileName: file.originalname,
          folder: "/products",
        });

        uploadedImages.push({
          url: uploaded.url,
          fileId: uploaded.fileId,
        });
      }
    }

    const product = await Product.create({
      product_category,
      attributes,
      ProductName,
      gst_in_percentage,
      product_mrp,
      Brand,
      detail_description,
      images: uploadedImages,
      isFeatured,
      isOnSale,
      discount_percentage,
    });

    return res.json({
      success: true,
      message: "Product created",
      product,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// ======================================
// 📦 GET ALL PRODUCTS
// ======================================
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("product_category")
      .populate("attributes.attribute");

    return res.json({
      success: true,
      products,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// ======================================
// 📦 GET SINGLE PRODUCT
// ======================================
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ productId: id })
      .populate("product_category")
      .populate("attributes.attribute");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({
      success: true,
      product,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// ======================================
// ✏️ UPDATE PRODUCT
// ======================================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ productId: id });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let updatedImages = product.images;

    // remove images
    let removeIds = [];
    if (req.body.removeImageIds) {
      try {
        removeIds = JSON.parse(req.body.removeImageIds);

        for (let fileId of removeIds) {
          await imagekit.deleteFile(fileId);
        }

        updatedImages = updatedImages.filter(
          (img) => !removeIds.includes(img.fileId)
        );
      } catch (e) {
        removeIds = [];
      }
    }

    // new images
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const base64 = file.buffer.toString("base64");

        const uploaded = await imagekit.upload({
          file: base64,
          fileName: file.originalname,
          folder: "/products",
        });

        updatedImages.push({
          url: uploaded.url,
          fileId: uploaded.fileId,
        });
      }
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { productId: id },
      {
        ...req.body,
        images: updatedImages,
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Product updated",
      product: updatedProduct,
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// ======================================
// 🗑️ SOFT DELETE PRODUCT
// ======================================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndUpdate(
      { productId: id },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Product deleted",
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};