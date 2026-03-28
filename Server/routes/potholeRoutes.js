const express = require("express");
const router = express.Router();
const multer = require("multer");
const Pothole = require("../models/Pothole");

// File upload config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// 👉 CREATE pothole
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const pothole = new Pothole({
      image: req.file.path,
      location: { lat, lng }
    });

    await pothole.save();
    res.json(pothole);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 GET all potholes
router.get("/", async (req, res) => {
  const potholes = await Pothole.find();
  res.json(potholes);
});

// 👉 UPDATE status
router.put("/:id", async (req, res) => {
  const { status } = req.body;

  const updated = await Pothole.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(updated);
});

module.exports = router;