import Product from "../models/product.model.js";
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
      images,
    } = req.body;

    const toBool = (v) => v === "true" || v === true;

    if (typeof product_category === "string") product_category = JSON.parse(product_category);
    if (typeof attributes === "string") attributes = JSON.parse(attributes);
    if (typeof images === "string") images = JSON.parse(images);

    isFeatured = toBool(isFeatured);
    isOnSale = toBool(isOnSale);

    let uploadedImages = [];

    // existing base64 images
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

    // file uploads (FAST parallel)
    if (req.files?.length) {
      const uploads = await Promise.all(
        req.files.map(async (file) => {
          const base64 = file.buffer.toString("base64");

          const uploaded = await imagekit.upload({
            file: base64,
            fileName: file.originalname,
            folder: "/products",
          });

          return {
            url: uploaded.url,
            fileId: uploaded.fileId,
          };
        })
      );

      uploadedImages.push(...uploads);
    }

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
      .populate("product_category");

    return res.json({
      success: true,
      count: products.length,
      products,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================
// 📦 GET SINGLE PRODUCT
// ======================================
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("product_category");

    if (!product || product.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
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
// ✏️ UPDATE PRODUCT
// ======================================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product || product.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const toBool = (v) => v === "true" || v === true;

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
      removeImageIds,
    } = req.body;

    if (typeof product_category === "string") product_category = JSON.parse(product_category);
    if (typeof attributes === "string") attributes = JSON.parse(attributes);

    let updatedImages = product.images;

    // REMOVE IMAGES
    if (removeImageIds) {
      const ids = JSON.parse(removeImageIds);

      await Promise.all(
        ids.map((fileId) => imagekit.deleteFile(fileId))
      );

      updatedImages = updatedImages.filter(
        (img) => !ids.includes(img.fileId)
      );
    }

    // ADD NEW IMAGES (FAST)
    if (req.files?.length) {
      const uploads = await Promise.all(
        req.files.map(async (file) => {
          const base64 = file.buffer.toString("base64");

          const uploaded = await imagekit.upload({
            file: base64,
            fileName: file.originalname,
            folder: "/products",
          });

          return {
            url: uploaded.url,
            fileId: uploaded.fileId,
          };
        })
      );

      updatedImages.push(...uploads);
    }

    const updateData = {
      images: updatedImages,
    };

    if (title !== undefined) updateData.title = title;
    if (ProductName !== undefined) updateData.ProductName = ProductName;
    if (stock !== undefined) updateData.stock = stock;
    if (product_mrp !== undefined) updateData.product_mrp = product_mrp;
    if (Brand !== undefined) updateData.Brand = Brand;
    if (detail_description !== undefined) updateData.detail_description = detail_description;

    if (isFeatured !== undefined) updateData.isFeatured = toBool(isFeatured);
    if (isOnSale !== undefined) updateData.isOnSale = toBool(isOnSale);

    if (discount_percentage !== undefined)
      updateData.discount_percentage = discount_percentage;

    if (attributes) updateData.attributes = attributes;
    if (product_category) updateData.product_category = product_category;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate("product_category");

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

    const product = await Product.findById(id);

    if (!product || product.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};