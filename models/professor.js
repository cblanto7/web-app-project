var mongoose = require('mongoose');

var professorSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  bio: String
});

module.exports = mongoose.model('Professor', professorSchema);