const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const messageSchema = new Schema({
  // Define message schema here
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: String,
  phone: String,
  email: String,
  message: String,
  status: {
    type: String,
    default: "pending",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = model("Message", messageSchema);

module.exports = Message;
