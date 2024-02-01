const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();

const uri = process.env.DB_URI;
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Create ratings
router.post("/", async (req, res) => {
  try {
    const rating = req.body;
    const database = client.db("appointify");
    const ratingsCollection = database.collection("ratings");

    const result = await ratingsCollection.insertOne(rating);
    res.send(result);
  } catch (error) {
    console.error("Error creating rating:", error);
    res.status(500).send({ error: true, message: "Error creating rating" });
  }
});

// Get ratings
router.get("/", async (req, res) => {
  try {
    const database = client.db("appointify");
    const ratingsCollection = database.collection("ratings");

    const result = await ratingsCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).send({ error: true, message: "Error fetching ratings" });
  }
});

module.exports = router;
