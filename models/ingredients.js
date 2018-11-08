const mongoose = require('mongoose');

const config = require('../config/database');

// Ingredient Schema
const IngredientSchema = new mongoose.Schema(
  {
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

const Ingredient = (module.exports = mongoose.model(
  'Ingredient',
  IngredientSchema
));
