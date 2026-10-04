const express = require("express");
const router = express.Router();
const multer = require("multer");
const Pothole = require("../models/Pothole");
const mongoose = require("mongoose");
const crypto = require("crypto");
const auth = require("../middleware/auth");


// ========================================
// FILE UPLOAD CONFIG
// ========================================

const storage = multer.diskStorage({

  destination: "uploads/",

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() + "-" + file.originalname
    );

  }

});

const upload = multer({
  storage
});


// ========================================
// CREATE POTHOLE REPORT
// PUBLIC
// ========================================

router.post(
  "/",
  upload.single("image"),
  async (req, res) => {

    try {

      const { lat, lng } = req.body;


      if (!req.file) {

        return res.status(400).json({
          error: "Pothole image is required"
        });

      }


      if (!lat || !lng) {

        return res.status(400).json({
          error: "Location is required"
        });

      }


     const date = new Date()
  .toISOString()
  .slice(0, 10)
  .replace(/-/g, "");

const randomCode = crypto
  .randomBytes(3)
  .toString("hex")
  .toUpperCase();

const reportId = `SC-${date}-${randomCode}`;


const pothole = new Pothole({

  reportId: reportId,

  image: req.file.path,

  location: {
    lat: Number(lat),
    lng: Number(lng)
  }

});


      await pothole.save();


      res.status(201).json({

        message: "Pothole reported successfully",

        reportId: pothole.reportId,

        status: pothole.status,

        severity: pothole.severity,

        location: pothole.location,

        createdAt: pothole.createdAt

      });


    } catch (err) {

      console.error(
        "Create pothole error:",
        err
      );

      res.status(500).json({
        error: err.message
      });

    }

  }
);


// ========================================
// PUBLIC: CHECK REPORT STATUS
// ========================================

router.get(
  "/status/:id",
  async (req, res) => {

    try {

      const id = req.params.id;

      let pothole = null;


      // New user-friendly Report ID

      if (
        id.startsWith("SC-")
      ) {

        pothole = await Pothole.findOne({
          reportId: id
        });

      }


      // Backward compatibility
      // for old MongoDB IDs

      else if (
        mongoose.Types.ObjectId.isValid(id)
      ) {

        pothole = await Pothole.findById(id);

      }


      if (!pothole) {

        return res.status(404).json({
          error: "Report not found"
        });

      }


      res.json({

        reportId:
          pothole.reportId ||
          pothole._id,

        status: pothole.status,

        severity: pothole.severity,

        location: pothole.location,

        createdAt: pothole.createdAt

      });


    } catch (err) {

      console.error(
        "Status check error:",
        err
      );

      res.status(400).json({
        error: "Invalid Report ID"
      });

    }

  }
);


// ========================================
// GET ALL POTHOLES
// ADMIN ONLY
// ========================================

router.get(
  "/",
  async (req, res) => {

    try {

      const potholes =
        await Pothole.find()
          .sort({
            createdAt: -1
          });

      res.json(potholes);

    } catch (err) {

      res.status(500).json({
        error: err.message
      });

    }

  }
);


// ========================================
// UPDATE STATUS
// ADMIN ONLY
// ========================================

// ========================================
// UPDATE STATUS
// ADMIN ONLY
// ========================================

router.put(
  "/:id",
  auth,
  async (req, res) => {

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

      // If marked Fixed, save the current time
      if (status === "Fixed") {

        updateData.fixedAt = new Date();

      } else {

        // If moved back from Fixed,
        // remove fixed time
        updateData.fixedAt = null;

      }

      const updated =
        await Pothole.findByIdAndUpdate(
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

  }
);


module.exports = router;