const mongoose = require("mongoose");

const employeSchema = new mongoose.Schema({
  id: Number,
  firstName: String,
  lastName: String,
  shift: Object,
});

module.exports = mongoose.model("Employe", employeSchema);
