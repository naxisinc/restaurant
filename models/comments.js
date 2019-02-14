const mongoose = require("mongoose");

// Comment Schema
const CommentSchema = new mongoose.Schema(
  {
    _creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    _plate: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    created_at: {
      type: Date,
      required: true,
      default: Date.now
    },
    headline: {
      type: String,
      trim: true
    },
    comment: {
      type: String,
      trim: true
    },
    reply: {
      type: String,
      trim: true
    },
    rate: {
      type: Number,
      required: true,
      default: 1
    }
  },
  {
    versionKey: false // esto es para evitar el campo __v q tanto problema dio en las busquedas
  }
);

const Comment = (module.exports = mongoose.model("Comment", CommentSchema));
