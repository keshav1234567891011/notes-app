const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  des: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Note", noteSchema);