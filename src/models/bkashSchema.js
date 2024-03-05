const mongoose = require("mongoose");

const bkashSchema = new mongoose.Schema({
    amount: Number,
    orderId: Number
});     

module.exports = bkashSchema;
