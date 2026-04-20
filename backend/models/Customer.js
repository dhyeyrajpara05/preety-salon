const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model("Customer", CustomerSchema);
