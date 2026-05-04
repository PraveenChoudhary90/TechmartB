import imagekit from "../utils/imagekit.js";
import Banner from "../../src/models/Banner.model.js";

// CREATE BANNER
export const createBanner = async (req, res) => {
  try {
    const body = Array.isArray(req.body) ? req.body[0] : req.body;
    const { banner_page, banner_name, images,banner_type } = body; // images = base64 array

    let uploadedImages = [];

    // Upload base64 images
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const upload = await imagekit.upload({
          file: images[i], // base64 string from frontend
          fileName: `banner_${Date.now()}_${i}.jpg`,
          folder: "/banners",
        });
        uploadedImages.push(upload.url);
      }
    }

    // If files are uploaded via multer
    const files = req.files || [];
    for (let i = 0; i < files.length; i++) {
      const upload = await imagekit.upload({
        file: files[i].buffer.toString("base64"),
        fileName: files[i].originalname || `banner_${Date.now()}_${i}.jpg`,
        folder: "/banners",
      });
      uploadedImages.push(upload.url);
    }

    const banner = await Banner.create({
      banner_name,
      banner_page,
      images: uploadedImages, // array of URLs
      banner_type,
    });

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: banner,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// GET ALL BANNERS
export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE BANNER
export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    // =====================
    // TEXT UPDATE
    // =====================
    if (req.body.banner_name) banner.banner_name = req.body.banner_name;
    if (req.body.banner_page) banner.banner_page = req.body.banner_page;
    if (req.body.banner_type) banner.banner_type = req.body.banner_type;

    // =====================
    // IMAGE ADD (NEW)
    // =====================
    if (req.files?.length) {
      for (let file of req.files) {
        const base64 = file.buffer.toString("base64");

        const upload = await imagekit.upload({
          file: base64,
          fileName: file.originalname,
          folder: "/banners",
        });

        banner.images.push(upload.url);
      }
    }

    await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: banner,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE BANNER
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    banner.isDeleted = true;
    banner.deletedAt = new Date();

    await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner soft deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};