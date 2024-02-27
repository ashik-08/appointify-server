const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

// get all users
router.get("/", async (req, res) => {
  try {
    const result = await User.find();
    res.send(result);
  } catch (error) {
    console.error(error);
    return res.send({ error: true, message: error.message });
  }
});

// check user for admin access
router.get("/admin/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.role === "admin") {
      res.send(true);
    }
  } catch (error) {
    console.error(error);
    return res.send({ error: true, message: error.message });
  }
});

// get userData
router.get("/:email", verifyToken, async (req, res) => {
  try {
    const email = req.params.email;
    const result = await User.findOne({ email });
    res.send(result);
  } catch (error) {
    console.error(error);
    return res.send({ error: true, message: error.message });
  }
});

// add a user to collection
router.post("/", async (req, res) => {
  try {
    const user = req.body;
    // query to find all users in the collection
    const query = { email: user?.email };
    // check if there already exist an user
    const isExist = await User.findOne(query);
    if (isExist) {
      return res.send({ message: "Already exists" });
    }
    const result = await User.create(user);
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
    return res.send({ error: true, message: error.message });
  }
});

// update a user profile
router.put("/:email", verifyToken, async (req, res) => {
  try {
    const query = { email: req.params.email };
    const updatedUser = {
      $set: {
        name: req.body.name,
        photo: req.body.photo,
      },
    };
    const result = await User.updateOne(query, updatedUser);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.send({ error: true, message: error.message });
  }
});

module.exports = router;
