import Attribute from "../models/attribute.model.js"

// ==============================
// ➕ CREATE ATTRIBUTE
// ==============================
export const createAttribute = async (req, res) => {
  try {
    const { name, parentAttribute } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    const attribute = await Attribute.create({
      name,
      parentAttribute: parentAttribute || null
    });

    // parent me child add karo
    if (parentAttribute) {
      await Attribute.findByIdAndUpdate(parentAttribute, {
        $push: { children: attribute._id }
      });
    }

    res.json({ success: true, attribute });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// 📦 GET ALL ATTRIBUTES
// ==============================
export const getAllAttributes = async (req, res) => {
  try {
    const attributes = await Attribute.find({ isDeleted: false })
      .populate("parentAttribute")
      .populate({
        path: "children",
        match: { isDeleted: false }
      });

    res.json({ success: true, attributes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// 📦 GET SINGLE ATTRIBUTE
// ==============================
export const getAttributeById = async (req, res) => {
  try {
    const attribute = await Attribute.findOne({
      _id: req.params.id,
      isDeleted: false
    })
      .populate("parentAttribute")
      .populate({
        path: "children",
        match: { isDeleted: false }
      });

    if (!attribute) {
      return res.status(404).json({ message: "Attribute not found" });
    }

    res.json({ success: true, attribute });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// ✏️ UPDATE ATTRIBUTE
// ==============================
export const updateAttribute = async (req, res) => {
  try {
    const { name } = req.body;

    const attribute = await Attribute.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { name },
      { new: true }
    );

    if (!attribute) {
      return res.status(404).json({ message: "Attribute not found or deleted" });
    }

    res.json({
      success: true,
      message: "Attribute updated",
      attribute
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// 🗑️ SOFT DELETE ATTRIBUTE
// ==============================
export const deleteAttribute = async (req, res) => {
  try {
    const attribute = await Attribute.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        isDeleted: true,
        deletedAt: new Date()
      },
      { new: true }
    );

    if (!attribute) {
      return res.status(404).json({ message: "Attribute not found or already deleted" });
    }

    // parent se unlink
    if (attribute.parentAttribute) {
      await Attribute.findByIdAndUpdate(attribute.parentAttribute, {
        $pull: { children: attribute._id }
      });
    }

    res.json({
      success: true,
      message: "Attribute soft deleted"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// ♻️ RESTORE ATTRIBUTE
// ==============================
export const restoreAttribute = async (req, res) => {
  try {
    const attribute = await Attribute.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: false,
        deletedAt: null
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Attribute restored",
      attribute
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};