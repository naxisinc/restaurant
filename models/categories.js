const mongoose = require('mongoose');

// Category Schema
const CategorySchema = new mongoose.Schema(
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

const Category = (module.exports = mongoose.model('Category', CategorySchema));
