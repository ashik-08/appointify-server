const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const messageSchema = new Schema({
  // Define user schema here
  name: String,
  phone: String,
  email: String,
  message: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = model("Message", messageSchema);

module.exports = Message;
