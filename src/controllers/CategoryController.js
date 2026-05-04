import Category from "../../src/models/CategoryModel.js";
import imagekit from "../utils/imagekit.js";

// ==============================
// ➕ CREATE CATEGORY (with ImageKit upload)
// ==============================
export const createCategory = async (req, res) => {
  try {
    const { name, file } = req.body;

    // Validation
    if (!name || !file) {
      return res.status(400).json({
        success: false,
        message: "Name and image are required",
      });
    }

    // Check duplicate category
    const exists = await Category.findOne({
      name,
      isDeleted: false,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    // Upload image to ImageKit
    const uploadResponse = await imagekit.upload({
      file: file, // base64 string
      fileName: `${name}-${Date.now()}.jpg`,
      folder: "/categories",
    });

    // Save category in DB
    const category = await Category.create({
      name,
      image: uploadResponse.url,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });

  } catch (err) {
    console.error("CREATE CATEGORY ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// 📦 GET ALL CATEGORIES
// ==============================
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      categories,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// 📦 GET CATEGORY BY ID
// ==============================
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      category,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// ✏️ UPDATE CATEGORY (safe update)
// ==============================
export const updateCategory = async (req, res) => {
  try {
    const { name, file } = req.body;

    const updateData = {};

    // update name if provided
    if (name) updateData.name = name;

    // update image if provided
    if (file) {
      const uploadResponse = await imagekit.upload({
        file: file,
        fileName: `update-${Date.now()}.jpg`,
        folder: "/categories",
      });

      updateData.image = uploadResponse.url;
    }

    const category = await Category.findOneAndUpdate(
      {
        _id: req.params.id,
        isDeleted: false,
      },
      updateData,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found or deleted",
      });
    }

    res.json({
      success: true,
      message: "Category updated successfully",
      category,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// 🗑️ SOFT DELETE CATEGORY
// ==============================
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      {
        _id: req.params.id,
        isDeleted: false,
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found or already deleted",
      });
    }

    res.json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// ♻️ RESTORE CATEGORY
// ==============================
export const restoreCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: false,
        deletedAt: null,
      },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      message: "Category restored successfully",
      category,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};