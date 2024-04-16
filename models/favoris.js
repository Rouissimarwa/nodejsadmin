const mongoose = require("mongoose");

const favorisSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  favoris: {
    type: Number,
    required: true,
  },
});

module.exports = favorisSchema;