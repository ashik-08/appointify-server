const express = require("express"); 
const mongoose = require("mongoose");
const router = express.Router();
const ratingSchema = require("../models/ratingSchema");
const rating = new mongoose.model("rating", ratingSchema);

//get all ratings
router.get("/", async (req, res) => {
    try {
        const data = await rating.find({});
        res.status(200).json({
            result: data,
            message: "All ratings retrieved successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "There was an error while fetching ratings"
        });
    }
});

// // post a rating
// router.post("/", async (req, res) => {
//     try {
//         const newRating = req.body;
//         const result = await rating.create(newRating);
//         res.status(201).send(result); 
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             error: "There was an error while saving the rating" 
//         });
//     }
// });

// post a rating
router.post("/", async (req, res) => {
    try {
        const newRating = new rating(req.body);
        await newRating.save();
        res.status(200).json({
            message: "Rating saved successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "There was an error while saving the rating"
        });
    }
});


// get rating by user email
router.get("/:email", async (req, res) => {
    try {
        const userEmail = req.params.email;
        const data = await rating.findOne({ email: userEmail });

        if (!data) {
            // If no rating is found for the specified email
            res.status(404).json({
                message: "No rating found for the given email"
            });
        } else {
            // If a rating is found
            res.status(200).json({
                result: data,
                message: "Rating retrieved successfully"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "There was an error while fetching the rating"
        });
    }
});


module.exports = router;