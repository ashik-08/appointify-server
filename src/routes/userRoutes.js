const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

// get all users
router.get("/", async (req, res) => {
  try {
    const result = await User.find();
    res.send(result);
  } catch (error) {
    console.error(error);
    return res.send({ error: true, message: error.message });
  }
});

// check user for admin access
router.get("/admin/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.role === "admin") {
      res.send(true);
    }
  } catch (error) {
    console.error(error);
    return res.send({ error: true, message: error.message });
  }
});

// get userData
router.get("/:email", verifyToken, async (req, res) => {
  try {
    const email = req.params.email;
    const result = await User.findOne({ email });
    res.send(result);
  } catch (error) {
    console.error(error);
    return res.send({ error: true, message: error.message });
  }
});

// add a user to collection
router.post("/", async (req, res) => {
  try {
    const user = req.body;
    // query to find all users in the collection
    const query = { email: user?.email };
    // check if there already exist an user
    const isExist = await User.findOne(query);
    if (isExist) {
      return res.send({ message: "Already exists" });
    }
    const result = await User.create(user);
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    return res.send({ error: true, message: error.message });
  }
});

// update a user profile
router.put("/:email", verifyToken, async (req, res) => {
  try {
    const query = { email: req.params.email };
    const updatedUser = {
      $set: {
        name: req.body.name,
        photo: req.body.photo,
      },
    };
    const result = await User.updateOne(query, updatedUser);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.send({ error: true, message: error.message });
  }
});



// <===========================>Availability api<========================================>
// Route for getting user availability
router.get("/availability/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Find the user by ID
    const user = await User.findOne({email:userId});

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user is found, return their availability
    res.json(user.availability);
  } catch (error) {
    console.error("Error fetching user availability:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route for adding availability to a user
router.post("/availability/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { day, slots } = req.body;
  console.log(userId);
// return
  try {
    // Find the user by ID
    const user = await User.findOne({email:userId});

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user already has availability for the specified day
    const existingAvailabilityIndex = user.availability.findIndex(
      (item) => item.day === day
    );

    if (existingAvailabilityIndex !== -1) {
      // If availability for the day already exists, append new slots
      user.availability[existingAvailabilityIndex].slots.push(...slots);
    } else {
      // If availability for the day doesn't exist, create a new entry
      user.availability.push({ day, slots });
    }

    // Save the updated user document
    await user.save();

    // Return the updated availability
    res.json(user.availability);
  } catch (error) {
    console.error("Error adding availability:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
