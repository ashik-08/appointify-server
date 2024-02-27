const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");


// GET route to retrieve all events
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error("Error retrieving events:", err);
    res.status(500).json({ error: "Error retrieving events" });
  }
});

// GET route to retrieve all events for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Retrieve all events associated with the user
    const events = await Event.find({ user: userId });
    res.json(events);
  } catch (err) {
    console.error("Error retrieving events:", err);
    res.status(500).json({ error: "Error retrieving events" });
  }
});

// GET route to retrieve a single event for a specific user
router.get('/:userId/events/:eventId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const eventId = req.params.eventId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the event by ID and associated user
    const event = await Event.findOne({ _id: eventId, user: userId });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("Error retrieving event:", err);
    res.status(500).json({ error: "Error retrieving event" });
  }
});



// POST route to create a new event for a specific user
router.post("/:userId", async (req, res) => {

  try {
    const userId = req.params.userId;
    console.log('events',userId);
      // return
    const eventData = req.body;
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



