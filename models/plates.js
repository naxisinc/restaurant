const mongoose = require('mongoose');

const config = require('../config/database');

// Plate Schema
const PlateSchema = new mongoose.Schema(
  {
    _ingredients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      }
    ],
    averagerate: {
      type: Number,
      required: true,
      default: 1
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

const Plate = (module.exports = mongoose.model('Plate', PlateSchema));
