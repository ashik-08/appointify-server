const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

// get all users
router.get("/",verifyToken,verifyAdmin, async (req, res) => {
  try {
    const currentPage = req.query.active;
    const limit = 10;
    const skip = (currentPage - 1) * limit;
    const result = await User.find().skip(skip).limit(limit);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
});

// get all message count
router.get("/count", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const result = await User.countDocuments();
    res.status(200).send({ count: result });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// check user for admin access
router.get("/admin/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).send({ message: "User not found" });
    }

    if (user.role === "admin") {
      res.send(true);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// get userData
router.get("/:email", verifyToken, async (req, res) => {
  try {
    const email = req.params.email;
    const result = await User.findOne({ email });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
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
      res.send({ message: "Already exists" });
    }
    const result = await User.create(user);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
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
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// update a user role to admin
router.patch("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await User.updateOne(
      { _id: userId },
      { $set: { role: "admin" } }
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
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
// sent body data like this formate {"day": "Sunday","slots": [{"start_time": "07:00", "end_time": "11:00"}]}
router.post("/availability/:userEmail", async (req, res) => {
  const userEmail = req.params.userEmail;
  const { day, slots } = req.body;
  try {
    // Find the user by ID
    const user = await User.findOne({email:userEmail});

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

// Route for updating slots for a specific day in user's availability
// pass body object like this {"start_time": "06:00", "end_time": "11:00"}
router.put("/availability/:userEmail/slots/:slotId", async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const slotId = req.params.slotId;
    const { start_time, end_time } = req.body; // the request body contains the updated start_time and end_time
    // Find the user by ID
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the slot by ID within the user's availability
    const slotToUpdate = user.availability.reduce((foundSlot, day) => {
      const slot = day.slots.find((slot) => slot._id == slotId);
      return slot ? slot : foundSlot;
    }, null);

    if (!slotToUpdate) {
      return res.status(404).json({ message: "Slot not found" });
    }

    // Update the start_time and end_time of the slot
    if (start_time !== undefined) {
      slotToUpdate.start_time = start_time;
    }
    if (end_time !== undefined) {
      slotToUpdate.end_time = end_time;
    }

    // Save the updated user
    await user.save();

    res
      .status(200)
      .json({ status: true, message: "Slot updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//  Remove a slot from a user's availability
//http://localhost:5000/users/removeSlot/forhadairdrop@gmail.com/slots/65df04bf336126e3277c982b
 
router.delete("/removeSlot/:userEmail/slots/:slotId",
   async (req, res) => {
     try {
       const userEmail = req.params.userEmail;
       const slotId = req.params.slotId;

       // Remove the slot using Mongoose findByIdAndUpdate with $pull operator
       const user = await User.findOneAndUpdate(
         { email: userEmail },
         {
           $pull: {
             "availability.$[].slots": { _id: slotId },
           },
         },
         { new: true }
       );

       if (!user) {
         return res.status(404).json({ error: "User not found" });
       }

       res.status(200).json({ message: "Slot removed successfully", user });
     } catch (error) {
       console.error(error);
       res.status(500).json({ error: "Internal Server Error" });
     }
   }
 );


 // remove a specific availability object from a user's availability
//  http://localhost:5000/users/removeDay/forhadairdrop@gmail.com/day/65debedc293382e58827c4f8
router.delete('/removeDay/:userEmail/day/:dayId', async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const dayId = req.params.dayId;

    // Remove the availability object using Mongoose findOneAndUpdate with $pull operator
    const user = await User.findOneAndUpdate({email:userEmail}, {
      $pull: { 
        availability: { _id: dayId } 
      }
    }, { new: true });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Availability object removed successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
