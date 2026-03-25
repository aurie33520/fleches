const mongoose = require('mongoose');

const gridSchema = new mongoose.Schema({
  gridId: String,
  layout: Array,
  clues: Object,
  solution: Array
});

module.exports = mongoose.model('Grid', gridSchema);