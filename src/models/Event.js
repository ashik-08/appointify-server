const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const eventSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  type: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  buffer_time: { type: Number, required: true },
  location: { type: String, required: true },
  platform: { type: String, required: true },
  participants: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      image: { type: String, required: true },
      message: { type: String, required: true },
    },
  ],
  scheduled_time: { type: String, required: false },
  status: { type: String, required: true },
  user: {
    type: String,
    require: true,
    ref: "User",
  },
  availability: [
    {
      day: {
        type: String,
        required: true,
        enum: [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
      },
      slots: [
        {
          start_time: {
            type: String,
            required: true,
            // validate: {
            //   validator: (value) => {
            //     const timeRegex = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
            //     return timeRegex.test(value);
            //   },
            //   message: (props) =>
            //     `${props.value} is not a valid time format (HH:MM)`,
            // },
          },
          end_time: {
            type: String,
            required: true,
            // validate: {
            //   validator: (value) => {
            //     const timeRegex = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
            //     return timeRegex.test(value);
            //   },
            //   message: (props) =>
            //     `${props.value} is not a valid time format (HH:MM)`,
            // },
          },
        },
      ],
    },
  ],
});

const Event = model("Event", eventSchema);

module.exports = Event;
