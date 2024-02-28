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
  availability: [
    {
      day: {
        type: String,
        required: true,
        enum: ["Saturday","Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
      slots: [
        {
          start_time: {
            type: String,
            required: true,
            validate: {
              validator: (value) => {
                const timeRegex = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
                return timeRegex.test(value);
              },
              message: (props) =>
                `${props.value} is not a valid time format (HH:MM)`,
            },
          },
          end_time: {
            type: String,
            required: true,
            validate: {
              validator: (value) => {
                const timeRegex = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
                return timeRegex.test(value);
              },
              message: (props) =>
                `${props.value} is not a valid time format (HH:MM)`,
            },
          },
        },
      ],
    },
  ],

});

const User = model("User", userSchema);

module.exports = User;
