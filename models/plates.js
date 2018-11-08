const mongoose = require('mongoose');

const config = require('../config/database');

// Plate Schema
const PlateSchema = new mongoose.Schema(
  {},
  {
    versionKey: false // esto es para evitar el campo __v q tanto problema dio en las busquedas
  }
);

const Plate = (module.exports = mongoose.model('Plate', PlateSchema));
