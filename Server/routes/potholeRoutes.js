const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const Pothole = require("../models/pothole");
const auth = require("../middleware/auth");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "smart-city-potholes",
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  }
});

const upload = multer({
  storage
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const date = new Date();
    const datePart =
      date.getFullYear().toString() +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0");

    const randomCode = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase();

    const reportId = `SC-${datePart}-${randomCode}`;

    const pothole = new Pothole({
      reportId,
      image: req.file ? req.file.path : null,
      location: {
        lat: parseFloat(req.body.lat),
        lng: parseFloat(req.body.lng)
      },
      severity: req.body.severity || "Medium",
      status: "Reported"
    });

    const savedPothole = await pothole.save();

    res.status(201).json({
      message: "Pothole reported successfully",
      reportId: savedPothole.reportId,
      pothole: savedPothole
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      error: err.message
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const potholes = await Pothole.find().sort({
      createdAt: -1
    });

    res.json(potholes);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

router.get("/status/:id", async (req, res) => {
  try {
    const id = req.params.id;

    let pothole;

    if (/^SC-\d{8}-[A-Z0-9]+$/i.test(id)) {
      pothole = await Pothole.findOne({
        reportId: id.toUpperCase()
      });
    } else {
      pothole = await Pothole.findById(id);
    }

    if (!pothole) {
      return res.status(404).json({
        error: "Report not found"
      });
    }

    res.json(pothole);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Reported",
      "In Progress",
      "Fixed"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status"
      });
    }

    const updateData = {
      status
    };

    if (status === "Fixed") {
      updateData.fixedAt = new Date();
    } else {
      updateData.fixedAt = null;
    }

    const updated = await Pothole.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true
      }
    );

    if (!updated) {
      return res.status(404).json({
        error: "Report not found"
      });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;