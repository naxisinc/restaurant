const mongoose = require('mongoose');

const config = require('../config/database');

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
      type: Number,
      required: true
    },
    totalfat: {
      type: Number,
      required: true
    },
    totalcarbs: {
      type: Number,
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