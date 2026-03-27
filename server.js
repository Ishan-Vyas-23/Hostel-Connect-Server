const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const upvoteRoutes = require("./routes/upvoteRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const noticeRoutes = require("./routes/noticeRoutes");

const cors = require("cors");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/upvotes", upvoteRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notices", noticeRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

mongoose
  .connect(process.env.MONGO_URI_HOSTEL_CONNECT)
  .then(() => {
    console.log("Connected to MongoDB...");
    app.listen(PORT, () => {
      console.log(`Server listening at PORT ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
