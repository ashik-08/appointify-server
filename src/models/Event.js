
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const eventSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  type: { type: String, required: true },
  duration: { type: Number, required: true },
  buffer_time: { type: Number, required: true },
  location: { type: String, required: true },
  participants: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
  ],
  scheduled_time: { type: Date, required: true },
  status: { type: String, required: true },
  user: {
    type: String,
    require:true,
    ref: "User",
  },
});





const Event = model("Event", eventSchema);

module.exports = Event;
