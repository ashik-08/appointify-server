const express = require("express");
const router = express.Router();
const Likes = require("../models/Likes");
const { ObjectId } = require("mongodb");
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

router.get("/", async (req, res) => {
  try {
    const result = await Likes.find();
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await Likes.findOne(query);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const newComment = req.body;
    const result = await Likes.create(newComment);
    res.status(201).send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.patch("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = req.body;
    const result = await Likes.updateOne(filter, updateDoc);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const queryId = { _id: new ObjectId(id) };
    const result = await Likes.deleteOne(queryId);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

module.exports = router;
