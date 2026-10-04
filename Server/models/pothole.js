const mongoose = require("mongoose");

const potholeSchema = new mongoose.Schema({

  reportId: {
    type: String,
    unique: true,
    sparse: true
  },

  image: String,

  location: {
    lat: Number,
    lng: Number
  },

  severity: {
    type: String,
    default: "Medium"
  },

  status: {
    type: String,
    default: "Reported"
  },

  // Time when pothole was marked Fixed
  fixedAt: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Pothole", potholeSchema);