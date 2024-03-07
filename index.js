require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const connectDB = require("./src/db/connectDB");
const userRoutes = require("./src/routes/userRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const blogs = require("./src/routes/blogs");
const comments = require("./src/routes/comments");
const likes = require("./src/routes/likes");
const ratingRoutes = require("./src/routes/ratingRoutes");
const newsLetterRoutes = require("./src/routes/newsLetterRoutes");
const bkashRoutes = require("./src/routes/bkashRoutes");
const port = process.env.PORT || 5000;
const eventsRoutes = require("./src/routes/EventRoutes");
const googleRoutes = require('./src/routes/GoogleRoutes');
const bkashMiddleware = require("./src/middlewares/bkashMiddleware");

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://appointify-d45b1.web.app",
      "https://appointify-d45b1.firebaseapp.com",
      "https://appointify.surge.sh",
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

// ratings related routes
app.use("/ratings", ratingRoutes);

// blog related routes
app.use("/blogs", blogs);

// comment related routes
app.use("/comments", comments);

// like related routes
app.use("/likes", likes);

// events related routes
app.use("/events", eventsRoutes);

//newsletter related routes
app.use("/newsletters", newsLetterRoutes);

// google calender api routes
app.use('/',googleRoutes)

// bkash payment api routes
app.use('/bkash',bkashMiddleware.bkash_auth, bkashRoutes);

app.get("/", (req, res) => {
  res.send("Appointify server is running!");
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
