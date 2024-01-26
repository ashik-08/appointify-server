const express = require("express");
const router = express.Router();
const Message = require("../models/Message")

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
