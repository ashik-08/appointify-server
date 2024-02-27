const router = require("express").Router();
const Blogs = require("../models/Blogs");
const { ObjectId } = require("mongodb");
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

router.get("/", async (req, res) => {
  const result = await Blogs.find();

  res.send(result);
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await Blogs.findOne(query);

  res.send(result);
});

router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  const item = req.body;
  const result = await Blogs.create(item);

  res.send(result);
});

router.patch("/:id", verifyToken, verifyAdmin, async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const updateDoc = req.body;
  const result = await Blogs.updateOne(filter, updateDoc);

  res.send(result);
});

router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  const id = req.params.id;
  const queryId = { _id: new ObjectId(id) };
  const result = await Blogs.deleteOne(queryId);

  res.send(result);
});

module.exports = router;
