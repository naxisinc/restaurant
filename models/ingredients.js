const mongoose = require('mongoose');

// Ingredient Schema
const IngredientSchema = new mongoose.Schema(
  {
    _plates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        requiered: true
      }
    ],
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
