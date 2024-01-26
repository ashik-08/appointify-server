const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// get all messages from collection
router.get("/", async (req, res) => {
  try {
    const result = await Message.find();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// add message to collection
router.post("/", async (req, res) => {
  try {
    const newMessage = req.body;
    const result = await Message.create(newMessage);
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    return res.send({ error: true, message: error.message });
  }
});

module.exports = router;
