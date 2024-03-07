const express = require("express"); 
const mongoose = require("mongoose");
const router = express.Router();
const newsLetterSchema = require("../models/newsLetterSchema");
const newsLetter = new mongoose.model("newsletter", newsLetterSchema);

// get all newsLetterData
router.get("/", async (req, res) => {
    try {
        const data = await newsLetter.find({});
        res.status(200).json({
            result: data,
            message: "All Newsletter Data retrieved successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "There was an error while fetching Newsletter Data"
        });
    }
});

// post a rating
router.post("/", async (req, res) => {
    try {
        const newsLetterData = new newsLetter(req.body);
        const {email} = newsLetterData;
        const  isEmailExist = await newsLetter.findOne({email});

        if(isEmailExist){
            return res.status(200).json({
                isExist:true,
                message: "User Data already exist"
            })
        }

        await newsLetterData.save();
        res.status(200).json({
            isExist:false,
            message: "User Data saved successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "There was an error while saving the User Data"
        });
    }
});

module.exports = router;