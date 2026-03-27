const mongoose = require("mongoose");
require("dotenv").config();

const Complaint = require("./models/Complaint");
const User = require("./models/User");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI_HOSTEL_CONNECT);
    console.log("DB connected");

    await Complaint.deleteMany({});
    console.log("Old complaints deleted");

    const users = await User.find({ role: "resident" });

    if (!users.length) {
      console.log("No resident users found");
      process.exit();
    }

    let userIndex = 0;
    const getUser = () => {
      const user = users[userIndex % users.length];
      userIndex++;
      return user._id;
    };

    const complaints = [
      // 🔌 ELECTRICAL
      {
        category: "Electrical",
        title: "Fan not working",
        description:
          "Ceiling fan has stopped working completely since yesterday.",
      },
      {
        category: "Electrical",
        title: "Light flickering",
        description: "Room light keeps flickering continuously at night.",
      },
      {
        category: "Electrical",
        title: "Switch board damaged",
        description: "Switch board near bed is loose and sparks sometimes.",
      },
      {
        category: "Electrical",
        title: "No power in room",
        description:
          "There is no electricity supply in the room since morning.",
      },
      {
        category: "Electrical",
        title: "Tube light not working",
        description:
          "Tube light is not turning on even after replacement attempt.",
      },

      // 🚿 PLUMBING
      {
        category: "Plumbing",
        title: "Water leakage in bathroom",
        description: "Water is leaking continuously from the tap in bathroom.",
      },
      {
        category: "Plumbing",
        title: "Blocked drain",
        description: "Bathroom drain is clogged and water is not draining.",
      },
      {
        category: "Plumbing",
        title: "No water supply",
        description: "No water is coming in the taps since early morning.",
      },
      {
        category: "Plumbing",
        title: "Low water pressure",
        description: "Water pressure is very low making it hard to use.",
      },
      {
        category: "Plumbing",
        title: "Flush not working",
        description: "Toilet flush is not working properly.",
      },

      // 🌐 INTERNET
      {
        category: "Internet",
        title: "WiFi not working",
        description:
          "Unable to connect to hostel WiFi network since yesterday.",
      },
      {
        category: "Internet",
        title: "Internet very slow",
        description: "Internet speed is extremely slow especially at night.",
      },
      {
        category: "Internet",
        title: "LAN port not working",
        description: "LAN port in the room is not detecting any connection.",
      },
      {
        category: "Internet",
        title: "Frequent disconnections",
        description: "Internet disconnects every few minutes.",
      },
      {
        category: "Internet",
        title: "No internet in block",
        description: "Entire block has no internet connectivity.",
      },

      // 🍽️ MESS
      {
        category: "Mess",
        title: "Food quality is poor",
        description: "Food served in mess is not fresh and lacks taste.",
      },
      {
        category: "Mess",
        title: "Mess hygiene issue",
        description: "Dining tables and utensils are not properly cleaned.",
      },
      {
        category: "Mess",
        title: "Repeated menu items",
        description: "Same dishes are repeated frequently without variation.",
      },
      {
        category: "Mess",
        title: "Milk quality issue",
        description: "Milk served in breakfast tastes stale.",
      },
      {
        category: "Mess",
        title: "Late food service",
        description: "Meals are often served late causing inconvenience.",
      },

      // 🧱 OTHER
      {
        category: "Other",
        title: "Broken window",
        description: "Window glass in corridor is broken and unsafe.",
      },
      {
        category: "Other",
        title: "Dirty corridor",
        description: "Corridor is not cleaned regularly.",
      },
      {
        category: "Other",
        title: "Water cooler not working",
        description: "Water cooler is not cooling water properly.",
      },
      {
        category: "Other",
        title: "Lift not working",
        description: "Lift has been out of service for 2 days.",
      },
      {
        category: "Other",
        title: "Garbage not collected",
        description: "Garbage bins are overflowing and not cleared.",
      },

      // EXTRA REALISTIC MIX
      {
        category: "Electrical",
        title: "Plug point not working",
        description: "Charging plug near study table is not working.",
      },
      {
        category: "Plumbing",
        title: "Tap handle broken",
        description: "Tap handle is broken and difficult to operate.",
      },
      {
        category: "Internet",
        title: "Router not responding",
        description: "Router in the corridor is not functioning.",
      },
      {
        category: "Mess",
        title: "Insufficient food quantity",
        description: "Food gets over quickly and is insufficient for students.",
      },
      {
        category: "Other",
        title: "Street light not working",
        description: "Street light near hostel entrance is not working.",
      },
    ];

    const finalData = complaints.map((c, i) => ({
      ...c,
      author: getUser(),
      status:
        i % 3 === 0 ? "Resolved" : i % 2 === 0 ? "In Progress" : "Submitted",
      severity: i % 3 === 0 ? "high" : i % 2 === 0 ? "medium" : "low",
      upvotesCount: (i * 3) % 15,
      location: {
        hostel: ["A", "B", "C"][i % 3],
        block: ["A", "B"][i % 2],
        room: String(100 + i),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await Complaint.insertMany(finalData);

    console.log("✅ Clean, logical complaints seeded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
