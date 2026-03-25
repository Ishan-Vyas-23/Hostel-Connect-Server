const mongoose = require("mongoose");
require("dotenv").config();

const Complaint = require("./models/Complaint");
const User = require("./models/User");

const categories = ["Electrical", "Plumbing", "Internet", "Mess", "Other"];
const statuses = ["Submitted", "In Progress", "Resolved"];

const titles = [
  "Fan not working",
  "Water leakage in bathroom",
  "WiFi extremely slow",
  "Food quality is poor",
  "Room light flickering",
  "No hot water",
  "Mess hygiene issue",
  "LAN port not working",
  "Drainage smell",
  "Broken window"
];

const descriptions = [
  "Issue has been happening for 3 days",
  "Needs urgent attention",
  "Very inconvenient for daily routine",
  "Affects multiple students",
  "Temporary fix not working",
  "Getting worse every day"
];

const hostels = ["A", "B", "C"];
const blocks = ["A", "B", "C"];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate() {
  const now = new Date();
  const past = new Date();
  past.setDate(now.getDate() - Math.floor(Math.random() * 15));
  return past;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI_HOSTEL_CONNECT);
    console.log("DB connected");

    const users = await User.find();

    if (!users.length) {
      console.log("No users found");
      return;
    }

    const complaints = [];

    for (let i = 0; i < 60; i++) {
      const user = getRandom(users);

      complaints.push({
        title: getRandom(titles),
        description: getRandom(descriptions),
        category: getRandom(categories),
        status: getRandom(statuses),
        severity: getRandom(["low", "medium", "high"]),
        upvotesCount: Math.floor(Math.random() * 20),
        author: user._id,
        location: {
          hostel: getRandom(hostels),
          block: getRandom(blocks),
          room: Math.floor(Math.random() * 400).toString(),
        },
        createdAt: getRandomDate(),
        updatedAt: new Date(),
      });
    }

    await Complaint.insertMany(complaints);

    console.log("🔥 Complaints seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();