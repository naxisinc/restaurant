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

// Getter
SizePlateSchema.path('price').get(num => {
  return (num / 100).toFixed(2);
});

// Setter
SizePlateSchema.path('price').set(num => {
  return num * 100;
});

const SizePlate = (module.exports = mongoose.model(
  'SizePlate',
  SizePlateSchema
));
