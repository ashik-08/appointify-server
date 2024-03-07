//test

const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const User = require("../models/User");
const {
  handleGetSpecificDaySlot,
  handleGetSpecificEventAllDay,
  handleGetSpecificEventAvailability,
  handleGetSingleEventById,
  handleGetAllEvents,
  handleGetAllSpecificUserEvents,
  handleAllSearchSpecificUser,
  handleCreateEvent,
  handleUpdateEvent,
  handleDeleteEvent,
  handleAddParticipants,
  handleGetSpecificEventAllParticipant,
  handleRemoveParticipant,
  handleRemoveAllParticipant,
  handleUpdateSpecificParticipant,
} = require("../controller/events/events");



// GET route to retrieve all events
router.get("/", handleGetAllEvents);

// All search matched events specific to the user
router.get(
  "/eventsSearch/:userEmail/:searchQuery",
  handleAllSearchSpecificUser
);

// GET route to retrieve all events for a specific user
router.get("/:userId", handleGetAllSpecificUserEvents);

// GET route to retrieve a single event for a specific user
router.get("/singleEvent/:eventId", handleGetSingleEventById);

// Get route to specific event availability all time
router.get("/eventAvailability/:eventId", handleGetSpecificEventAvailability);
//Get event available time slots by specific day name
router.get("/eventAvailability/:eventId/:day", handleGetSpecificDaySlot);

//Get all event days name as array
router.get("/dayAvailability/:eventId/allDays", handleGetSpecificEventAllDay);

// POST route to create a new event for a specific user
router.post("/:userId", handleCreateEvent);

// PUT route to update one or more fields of a specific event
router.put("/updateEvent/:eventId", handleUpdateEvent);

// DELETE route to delete an event by its ID
router.delete("/removeEvent/:eventId", handleDeleteEvent);

// <=======================>participants <===============================>

// GET route to retrieve all participants for a specific event
router.get("/participants/:eventId", handleGetSpecificEventAllParticipant);
// POST route to add or update participants for a specific event
router.post("/addParticipants/:eventId", handleAddParticipants);

// PUT route to update a specific participant in the participants array for a specific event
router.put(
  "/updateParticipants/:eventId/:participantId",handleUpdateSpecificParticipant);

// DELETE route to remove a participant from all events by their ID
router.delete("/removeParticipant/:participantId", handleRemoveParticipant);

// DELETE route to remove all participants from a specific event
router.delete("/removeAllParticipants/:eventId", handleRemoveAllParticipant);

module.exports = router;
