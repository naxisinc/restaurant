const mongoose = require("mongoose");

// VisitorsCounter Schema
const VisitorsCounterSchema = new mongoose.Schema(
  {
    route: {
      type: String,
      required: true,
      minlength: 1,
      trim: true
    },
    counter: {
      type: Number,
      default: 0
    }
    // counted_at: {
    //   type: Date,
    //   required: true,
    //   default: Date.now
    // }
  },
  {
    versionKey: false // esto es para evitar el campo __v q tanto problema dio en las busquedas
  }
);

const VisitorsCounter = (module.exports = mongoose.model(
  "VisitorsCounter",
  VisitorsCounterSchema
));
