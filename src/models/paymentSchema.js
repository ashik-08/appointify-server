const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  amount: {
    type: Number,
  },
  trxID: {
    type: String,
  },
  paymentID: {
    type: String,
  },
  date: {
    type: String,
  },
});

module.exports = paymentSchema;
