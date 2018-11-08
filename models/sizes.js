const mongoose = require('mongoose');

const config = require('../config/database');

// Size Schema
const SizeSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      requiered: true
    }
  },
  {
    versionKey: false // esto es para evitar el campo __v q tanto problema dio en las busquedas
  }
);

const Size = (module.exports = mongoose.model('Size', SizeSchema));
