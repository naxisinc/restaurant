const mongoose = require('mongoose');

// SizePlate Schema
const SizePlateSchema = new mongoose.Schema(
  {
    _size: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    _plate: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    calories: {
      type: String,
      required: true
    },
    totalfat: {
      type: String,
      required: true
    },
    totalcarbs: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false // esto es para evitar el campo __v q tanto problema dio en las busquedas
  }
);

const SizePlate = (module.exports = mongoose.model(
  'SizePlate',
  SizePlateSchema
));
