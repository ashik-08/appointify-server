const Event = require("../../models/Event");
const User = require("../../models/User");


async function handleGetAllEvents(req,res){
    try {
      const events = await Event.find();
      res.json(events);
    } catch (err) {
      console.error("Error retrieving events:", err);
      res.status(500).json({ error: "Error retrieving events" });
    }
}

async function handleAllSearchSpecificUser(req,res){
    const { userEmail, searchQuery } = req.params;

    try {
      // Construct a Mongoose query to filter events based on search criteria
      const events = await Event.find({
        user: userEmail,
        type: { $regex: new RegExp(searchQuery, "i") }, // Case-insensitive search
      });

      res.json(events);
    } catch (err) {
      console.error("Error retrieving events:", err);
      res.status(500).json({ error: "Error retrieving events" });
    }
}

async function handleGetAllSpecificUserEvents(req,res){
    try {
      const userId = req.params.userId;

      // Find the user by Id
      const user = await User.findOne({ email: userId });
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
}

async function handleGetSingleEventById(req, res) {
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
}

async function handleGetSpecificEventAvailability(req, res) {
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
}

async function handleGetSpecificEventAllDay(req, res) {
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
}
async function handleGetSpecificDaySlot(req, res) {
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

    // Find event available time slots
    const event = await Event.findOne(
      { _id: eventId, availability: { $elemMatch: { day: requestedDay } } },
      { "availability.$": 1 }
    );

    // Find event duration
    const { duration } = await Event.findById(eventId, { _id: 0, duration: 1 });
    const eventDuration = duration;

    if (
      !event ||
      !event.availability ||
      !event.availability.length ||
      !duration
    ) {
      return res
        .status(404)
        .json({ error: "Event not found or day not available" });
    }

    res.status(200).json({
      eventSpecificDaySlots: event.availability[0].slots,
      eventDuration,
    });
  } catch (error) {
    console.error(
      "Error retrieving event availability for specified day:",
      error
    );
    res.status(500).json({ error: "Internal server error" });
  }
}

async function handleCreateEvent(req,res){
    try {
      const userId = req.params.userId;
      const eventData = req.body;
      // Find the user by ID
      const user = await User.findOne({ email: userId });
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
}

async function handleUpdateEvent(req,res){
    try {
      const eventId = req.params.eventId;
      const updateFields = req.body;
      //Find event by Id and associated user, and update it's field
      const updatedEvent = await Event.findOneAndUpdate(
        { _id: eventId },
        updateFields,
        { new: true } //Return update document
      );

      if (!updatedEvent) {
        return res.status(404).json({ error: "Event not found" });
      }
      // console.log(updateFields);
      res.json(updatedEvent);
    } catch (err) {
      console.error("Error updating event:", err);
      res.status(500).json({ error: "Error updating Event" });
    }
}

async function handleDeleteEvent(req,res){
    try {
      const eventId = req.params.eventId;

      // Find the event by ID and delete it
      const deletedEvent = await Event.findByIdAndDelete(eventId);
      if (!deletedEvent) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.json({ status: true, message: "Event deleted successfully" });
    } catch (err) {
      console.error("Error deleting event:", err);
      res.status(500).json({ error: "Error deleting event" });
    }
}
// <=======================>participants <===============================>
async function handleGetSpecificEventAllParticipant(req,res){
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
}

async function handleAddParticipants(req,res){
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
}

async function handleUpdateSpecificParticipant(req,res){
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

async function handleRemoveParticipant(req,res){
    try {
      const participantId = req.params.participantId;

      // Update all events where the participant exists to remove them from the participants array
      await Event.updateMany(
        { "participants._id": participantId },
        { $pull: { participants: { _id: participantId } } }
      );

      res.json({
        status: true,
        message: "Participant removed from all events",
      });
    } catch (err) {
      console.error("Error deleting participant from events:", err);
      res.status(500).json({ error: "Error deleting participant from events" });
    }
}

async function handleRemoveAllParticipant(req,res){
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

      res.json({
        status: true,
        message: "All participants removed from the event",
      });
    } catch (err) {
      console.error("Error deleting participants from the event:", err);
      res
        .status(500)
        .json({ error: "Error deleting participants from the event" });
    }
}
module.exports = {
  handleGetAllEvents,
  handleAllSearchSpecificUser,
  handleGetAllSpecificUserEvents,
  handleGetSingleEventById,
  handleGetSpecificEventAvailability,
  handleGetSpecificDaySlot,
  handleGetSpecificEventAllDay,
  handleGetSpecificEventAllParticipant,
  handleCreateEvent,
  handleUpdateEvent,
  handleDeleteEvent,
  handleAddParticipants,
  handleUpdateSpecificParticipant,
  handleRemoveParticipant,
  handleRemoveAllParticipant,
};
