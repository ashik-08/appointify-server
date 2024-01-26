const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  // Define user schema here
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: String,
  photo: String,
  email: String,
  status: String,
  role: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = model("User", userSchema);

module.exports = User;
