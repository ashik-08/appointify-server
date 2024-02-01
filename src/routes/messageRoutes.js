const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

// get all messages from collection
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const currentPage = req.query.active;
    const limit = 10;
    const skip = (currentPage - 1) * limit;
    const result = await Message.find().skip(skip).limit(limit);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// get all message count
router.get("/count", async (req, res) => {
  try {
    const result = await Message.countDocuments();
    res.status(200).send({ count: result });
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

// update status of a message
router.patch("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const messageId = req.params.id;
    console.log(messageId);
    const result = await Message.updateOne(
      { _id: messageId },
      { $set: { status: "completed" } }
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// delete a message from collection
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const messageId = req.params.id;
    const result = await Message.findOneAndDelete({ _id: messageId });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
