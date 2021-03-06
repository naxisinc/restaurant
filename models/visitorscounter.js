const mongoose = require("mongoose");

// VisitorsCounter Schema
const VisitorsCounterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 1,
      trim: true
    },
    value: {
      type: Number,
      default: 1
    }
  },
  {
    versionKey: false // esto es para evitar el campo __v q tanto problema dio en las busquedas
  }
);

const VisitorsCounter = (module.exports = mongoose.model(
  "VisitorsCounter",
  VisitorsCounterSchema
));
