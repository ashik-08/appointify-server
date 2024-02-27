const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");

// GET route to retrieve all events
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error("Error retrieving events:", err);
    res.status(500).json({ error: "Error retrieving events" });
  }
});

// GET route to retrieve all events for a specific user
router.get("/:userId", async (req, res) => {
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
router.get("/:userId/:eventId", async (req, res) => {
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
    console.log("events", userId);
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

// POST route to add or update participants for a specific event

router.post("/:userId/:eventId/participants", async (req, res) => {
  try {
    const userId = req.params.userId;
    const eventId = req.params.eventId;
    const newParticipants = req.body;

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

    // Add new participants to the participants array
    event.participants.push(newParticipants);
    await event.save();

    res.json({ success: true, message: "Participant added successfully" });
  } catch (err) {
    console.error("Error adding participants:", err);
    res.status(500).json({ error: "Error adding participants" });
  }
});

// PUT route to update one or more fields of a specific event
router.put("/:userId/:eventId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const eventId = req.params.eventId;
    const updateFields = req.body;

    //Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    //Find event by Id and associated user, and update it's field
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, user: userId },
      updateFields,
      { new: true } //Return update document
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(updatedEvent);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ error: "Error updating Event" });
  }
});

//PUT route to update specific event participant
router.put(
  "/:userId/:eventId/:participantId/updateParticipants",
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const eventId = req.params.eventId;
      const participantId = req.params.participantId;
      const updatedParticipantData = req.body;

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

      // Find the index of the participant to update in the participants array
      const participantIndex = event.participants.findIndex(
        (participant) => participant._id == participantId
      );
      if (participantIndex === -1) {
        return res
          .status(404)
          .json({ error: "Participant not found in the event" });
      }

      // Update the participant with the new data
      event.participants[participantIndex] = {
        ...event.participants[participantIndex],
        ...updatedParticipantData,
      };
      await event.save();

      res.json(event);
    } catch (err) {
      console.error("Error updating participant:", err);
      res.status(500).json({ error: "Error updating participant" });
    }
  }
);
module.exports = router;
