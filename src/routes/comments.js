const express = require("express");
const router = express.Router();
const Comments = require("../models/Comments");
const { ObjectId } = require("mongodb");
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

router.get("/", async (req, res) => {
  try {
    const result = await Comments.find();
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
    const result = await Comments.findOne(query);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const newComment = req.body;
    const result = await Comments.create(newComment);
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
    const result = await Comments.updateOne(filter, updateDoc);
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
    const result = await Comments.deleteOne(queryId);
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

module.exports = router;
