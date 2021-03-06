const mongoose = require("mongoose");

// Plate Schema
const PlateSchema = new mongoose.Schema(
  {
    _ingredients: [
      {
        type: mongoose.Schema.Types.ObjectId
        // required: true
      }
    ],
    _category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    averagerate: {
      type: Number,
      default: 0
    },
    img: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false // esto es para evitar el campo __v q tanto problema dio en las busquedas
  }
);

const Plate = (module.exports = mongoose.model("Plate", PlateSchema));
