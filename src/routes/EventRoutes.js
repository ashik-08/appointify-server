//test


const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");

// GET route to retrieve all events
router.get("/", async (req, res) => {
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

    // Find the user by Id
    const user = await User.findOne({email:userId});
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
router.get("/singleEvent/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    // Find the event by ID and associated user
    const event = await Event.findOne({ _id: eventId });
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("Error retrieving event:", err);
    res.status(500).json({ error: "Error retrieving event" });
  }
});



// Get route to specific event availability

router.get("/eventAvailability/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findOne({ _id: eventId }, { availability: 1 });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ availability: event.availability });
  } catch (err) {
    console.error("Error retrieving event availability:", err);
    res.status(500).json({ error: "Error retrieving event availability" });
  }
});
router.get("/eventAvailability/:eventId/:day", async (req, res) => {

  try {
    const eventId = req.params.eventId;
    const requestedDay = req.params.day;

    // Validate the requested day
    const validDays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    if (!validDays.includes(requestedDay)) {
      return res.status(400).json({ error: "Invalid day" });
    }

    const event = await Event.findOne(
      { _id: eventId, availability: { $elemMatch: { day: requestedDay } } },
      { "availability.$": 1 }
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
console.log(event);
    res.status(200).json( event.availability[0].slots );
  } catch (error) {
    console.error(
      "Error retrieving event availability for specified day:",
      error
    );
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/dayAvailability/:eventId/allDays", async (req, res) => {
try {
  const eventId = req.params.eventId;

  // Find the event by ID
  const event = await Event.findById(eventId);

  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }

  // Extract day names from the event's availability data
  const dayNames = event.availability.map((avail) => avail.day);

  res.status(200).json({ dayNames });
} catch (error) {
  console.error("Error retrieving day names for event:", error);
  res.status(500).json({ error: "Internal server error" });
}
});



// POST route to create a new event for a specific user
router.post("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const eventData = req.body;
    // Find the user by ID
    const user = await User.findOne({email:userId});
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // console.log("events", eventData);
    // return

    // Add user ID to eventData
    eventData.user = userId;

    // Create a new event
    const newEvent = new Event(eventData);
    await newEvent.save();

    // Add the event to the user's events array
    // user.events.push(newEvent);
    // await user.save();

    res.status(201).json(newEvent);
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Error creating event" });
  }
});


// PUT route to update one or more fields of a specific event
router.put("/updateEvent/:eventId", async (req, res) => {
  try {;
    const eventId = req.params.eventId;
    const updateFields = req.body;

    //Find event by Id and associated user, and update it's field
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId},
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

// DELETE route to delete an event by its ID
router.delete('/removeEvent/:eventId', async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // Find the event by ID and delete it
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({status:true, message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Error deleting event" });
  }
});

// <=======================>participants <===============================>

// GET route to retrieve all participants for a specific event
router.get("/participants/:eventId", async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Extract participants from the event and return
    const participants = event.participants;
    res.json(participants);
  } catch (err) {
    console.error("Error retrieving participants:", err);
    res.status(500).json({ error: "Error retrieving participants" });
  }
});
// POST route to add or update participants for a specific event
router.post("/addParticipants/:eventId", async (req, res) => {
  


  
  try {
    const eventId = req.params.eventId;
    const newParticipants = req.body;
    console.log(newParticipants);
// return
    // Find the event by ID and associated user
    const event = await Event.findOne({ _id: eventId });
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

// PUT route to update a specific participant in the participants array for a specific event
router.put(
  "/updateParticipants/:eventId/:participantId",
  async (req, res) => {
    try {
      const eventId = req.params.eventId;
      const participantId = req.params.participantId;
      const updatedParticipantData = req.body;

      // Find the event by ID and the participant by ID within it, and update the participant
      const event = await Event.findOneAndUpdate(
        { _id: eventId, "participants._id": participantId },
        { $set: { "participants.$": updatedParticipantData } },
        { new: true }
      );
      if (!event) {
        return res
          .status(404)
          .json({ message: "Event or participant not found" });
      }

      res
        .status(200)
        .json({ message: "Participant updated successfully", event });
    } catch (err) {
      console.error("Error updating participant:", err);
      res.status(500).json({ error: "Error updating participant" });
    }
  }
);

// DELETE route to remove a participant from all events by their ID
router.delete('/removeParticipant/:participantId', async (req, res) => {
  try {
    const participantId = req.params.participantId;

    // Update all events where the participant exists to remove them from the participants array
    await Event.updateMany({ "participants._id": participantId }, { $pull: { participants: { _id: participantId } } });

    res.json({status: true, message: "Participant removed from all events" });
  } catch (err) {
    console.error("Error deleting participant from events:", err);
    res.status(500).json({ error: "Error deleting participant from events" });
  }
});

// DELETE route to remove all participants from a specific event
router.delete('/removeAllParticipants/:eventId', async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Clear the participants array for the event
    event.participants = [];
    await event.save();

    res.json({ status:true, message: "All participants removed from the event" });
  } catch (err) {
    console.error("Error deleting participants from the event:", err);
    res.status(500).json({ error: "Error deleting participants from the event" });
  }
});




module.exports = router;
