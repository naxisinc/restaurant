const mongoose = require("mongoose");

// DeviceCounter Schema
const DeviceCounterSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true
    },
    counted_at: {
      type: Date,
      required: true,
      default: Date.now
    }
  },
  {
    versionKey: false // esto es para evitar el campo __v q tanto problema dio en las busquedas
  }
);

const DeviceCounter = (module.exports = mongoose.model(
  "DeviceCounter",
  DeviceCounterSchema
));
