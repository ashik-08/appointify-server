const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    photoURL: String,
    displayName: String,
    rating:String,
    message:String,
    timeStamp:{
        type: Date,
        default: Date.now,
    }
});

module.exports = ratingSchema; 