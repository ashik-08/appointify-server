const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");


router.get('/',async(req,res)=>{
  try {
    const events = await Event.find()
    res.send(events)
  } catch (error) {
    console.log(error);
    
  }
})



// POST route to create a new event for a specific user
router.post("/:userId", async (req, res) => {

  try {
    const userId = req.params.userId;
    console.log('events',userId);
      // return
    const eventData = req.body;
console.log(userId);
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add user ID to eventData
    eventData.user = userId;

    // Create a new event
    const newEvent = new Event(eventData);
    await newEvent.save();

    // Add the event to the user's events array
    user.events.push(newEvent);
    await user.save();

    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Error creating event" });
  }
});

module.exports = router;



