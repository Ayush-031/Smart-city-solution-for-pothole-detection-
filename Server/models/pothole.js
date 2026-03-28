const mongoose = require("mongoose");

const potholeSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Pothole", potholeSchema);