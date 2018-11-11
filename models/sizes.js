const mongoose = require('mongoose');

// Size Schema
const SizeSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      minlength: 1,
      trim: true
    }
  },
  {
    versionKey: false // esto es para evitar el campo __v q tanto problema dio en las busquedas
  }
);

const Size = (module.exports = mongoose.model('Size', SizeSchema));
