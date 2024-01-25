const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const connectDB = require("./src/db/connectDB");
require("dotenv").config();
const userRoutes = require("./src/routes/userRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const port = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://appointify-d45b1.web.app/",
    ],
    credentials: true,
  })
);
app.use(express.json());

// connect to db
connectDB();

// jwt auth related api
app.post("/jwt", async (req, res) => {
  try {
    const user = req.body;
    // console.log("from /jwt -- user:", user);
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "2h",
    });
    // console.log("from /jwt -- token:", token);
    res.send({ token });
  } catch (error) {
    console.log(error);
    return res.send({ error: true, message: error.message });
  }
});

// user related routes
app.use("/users", userRoutes);

// message related routes
app.use("/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Appointify server is running!");
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
