const mongoose = require("mongoose");

const employeShift = new mongoose.Schema({
  shift: Object,
});

module.exports = mongoose.model("Shift", employeShift);
