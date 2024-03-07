require("dotenv").config();
const dayjs = require("dayjs");
const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

// ====================== Google API ======================
const oauth2Client = new google.auth.OAuth2(
  process.env.OAUTH_CLIENT,
  process.env.OAUTH_SECRET,
  process.env.REDIRECT_URL
);


const calendar = google.calendar({
  version: "v3",
  auth: oauth2Client,
});

const scopes = ["https://www.googleapis.com/auth/calendar"];

// ====================== Routes ======================

/**
 * Initiates the Google OAuth2 authentication flow.
 * @route GET /google
 * @returns {object} - Redirects to the Google authorization URL.
 */
router.get("/google", async (req, res) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });
    // res.redirect(url);
    res.send(url)
  } catch (err) {
    console.error("Error initiating Google authentication:", err);
    res.status(500).send({ message: "Error during Google authentication" });
  }
});

/**
 * Handles the Google OAuth2 redirect callback.
 * @route GET /google/redirect
 * @param {string} code - The authorization code received from Google.
 * @returns {object} - Response message indicating successful login.
 */
router.get("/google/redirect", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // res.send({ status: true, message: "You have successfully logged in" });
    res.redirect("http://localhost:5173/bookingFrom");
  } catch (error) {
    console.error("Error retrieving access tokens:", error);
    res.status(500).send({ message: "Error during Google authorization" });
  }
});

/**
 * Schedules a new event on the user's calendar.
 * @route GET /schedule_event
 * @returns {object} - Response message indicating event creation.
 */
router.post("/schedule_event", async (req, res) => {
  try {
    const {
      description,
      location,
      duration,
      title,
      scheduled_time,
      participant,
    } = req.body;
    const event = {
      summary: title,
      location: location,
      description: "whats on your mind",
      start: {
        dateTime: dayjs(scheduled_time),
        timeZone: "Asia/Dhaka",
      },

      end: {
        dateTime: dayjs(scheduled_time).add(duration, "minute").format(),
        timeZone: "Asia/Dhaka",
      },
      conferenceData: {
        createRequest: {
          requestId: uuid(),
        },
      },
      attendees: participant
    };

const response = await calendar.events.insert({
  calendarId: "primary",
  requestBody: event,
  conferenceDataVersion: 1,
});
const meetLink = response.data.hangoutLink;

    res.send({ message: "Event created successfully" ,meetLink});
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).send({ message: "Error creating event" });
  }
});











module.exports = router;
