const mongose = require("mongoose");

const newsLetterSchema = new mongose.Schema({
    email: {
        type: String,
        required: true,
    },
    registrationTime:{
        type: Date,
        default: Date.now,
    }
});     

module.exports = newsLetterSchema;
