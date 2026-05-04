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
      title,
      ProductName,
      stock,
      gst_in_percentage,
      product_mrp,
      Brand,
      detail_description,
      isFeatured,
      isOnSale,
      discount_percentage,
      images
    } = req.body;

    // =========================
    // 🔹 SAFE JSON PARSING
    // =========================
    if (typeof attributes === "string") {
      attributes = JSON.parse(attributes || "[]");
    }

    if (typeof product_category === "string") {
      product_category = JSON.parse(product_category || "[]");
    }

    if (typeof images === "string") {
      images = JSON.parse(images || "[]");
    }

    // =========================
    // 🔹 BOOLEAN FIX
    // =========================
    isFeatured = isFeatured === "true" || isFeatured === true;
    isOnSale = isOnSale === "true" || isOnSale === true;

    // =========================
    // 🔹 IMAGE UPLOAD
    // =========================
    let uploadedImages = [];

    if (Array.isArray(images)) {
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

    if (req.files?.length) {
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

    // =========================
    // 🔹 CREATE PRODUCT
    // =========================
    const product = await Product.create({
      product_category,
      attributes,
      title,
      ProductName,
      stock,
      gst_in_percentage,
      product_mrp,
      Brand,
      detail_description,
      images: uploadedImages,
      isFeatured,
      isOnSale,
      discount_percentage,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================
// 📦 GET ALL PRODUCTS
// ======================================
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false })
      .populate("product_category")
      .populate("attributes.attribute");

    return res.json({
      success: true,
      count: products.length,
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

    // ==============================
    // 🔍 FIND PRODUCT BY OBJECT ID
    // ==============================
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ==============================
    // ✅ PARSE SAFE INPUTS
    // ==============================
    let attributes = req.body.attributes;
    let product_category = req.body.product_category;

    if (typeof attributes === "string") {
      try {
        attributes = JSON.parse(attributes);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid attributes format",
        });
      }
    }

    if (typeof product_category === "string") {
      try {
        product_category = JSON.parse(product_category);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid product_category format",
        });
      }
    }

    let updatedImages = product.images;

    // ==============================
    // 🗑️ REMOVE IMAGES
    // ==============================
    if (req.body.removeImageIds) {
      try {
        const removeIds = JSON.parse(req.body.removeImageIds);

        await Promise.all(
          removeIds.map((fileId) => imagekit.deleteFile(fileId))
        );

        updatedImages = updatedImages.filter(
          (img) => !removeIds.includes(img.fileId)
        );
      } catch {}
    }

    // ==============================
    // 📤 ADD NEW IMAGES
    // ==============================
    if (req.files?.length) {
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

    // ==============================
    // 🛡️ SAFE UPDATE FIELDS
    // ==============================
    const updateData = {
      images: updatedImages,
    };

    if (req.body.title) updateData.title = req.body.title;
    if (req.body.ProductName) updateData.ProductName = req.body.ProductName;
    if (req.body.stock) updateData.stock = req.body.stock;
    if (req.body.product_mrp) updateData.product_mrp = req.body.product_mrp;
    if (req.body.Brand) updateData.Brand = req.body.Brand;
    if (req.body.detail_description) updateData.detail_description = req.body.detail_description;

    if (req.body.isFeatured !== undefined)
      updateData.isFeatured = req.body.isFeatured === "true" || req.body.isFeatured === true;

    if (req.body.isOnSale !== undefined)
      updateData.isOnSale = req.body.isOnSale === "true" || req.body.isOnSale === true;

    if (req.body.discount_percentage)
      updateData.discount_percentage = req.body.discount_percentage;

    if (attributes) updateData.attributes = attributes;
    if (product_category) updateData.product_category = product_category;

    // ==============================
    // ✏️ UPDATE PRODUCT
    // ==============================
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate("product_category")
      .populate("attributes.attribute");

    return res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ======================================
// 🗑️ SOFT DELETE PRODUCT
// ======================================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Product deleted successfully",
      product,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};