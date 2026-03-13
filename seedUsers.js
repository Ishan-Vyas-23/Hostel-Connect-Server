const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI_HOSTEL_CONNECT);

    console.log("Connected to MongoDB");

    await User.deleteMany({});

    const users = [
      {
        name: "Ishan Vyas",
        email: "ishan23vyas@gmail.com",
        enrolmentNo: "0801CS241066",
        hostel: "A",
        block: "A",
        room: "301",
        role: "resident",
        year: "2rd",
        passwordHash: "123456",
      },
      {
        name: "Divyansh Soni",
        email: "divyanshsoni9a@gmail.com",
        enrolmentNo: "0801CS241055",
        hostel: "A",
        block: "B",
        room: "302",
        role: "resident",
        year: "2nd",
        passwordHash: "123456",
      },
      {
        name: "Kashish",
        email: "kashishpahwa618@gmail.com",
        enrolmentNo: "0801CS241074",
        hostel: "C",
        block: "B",
        room: "303",
        role: "resident",
        year: "2nd",
        passwordHash: "123456",
      },
      {
        name: "Ishika",
        email: "ishikajain5135@gmail.com",
        enrolmentNo: "0801CS241067",
        hostel: "D",
        block: "B",
        room: "308",
        role: "resident",
        year: "2nd",
        passwordHash: "123456",
      },
      {
        name: "Jyotirbhanu",
        email: "jyotirbhanusharma@gmail.com",
        enrolmentNo: "0801CS2410",
        hostel: "A",
        block: "B",
        room: "306",
        role: "resident",
        year: "2nd",
        passwordHash: "123456",
      },
      {
        name: "Hostel Staff",
        email: "staff@hostel.com",
        enrolmentNo: "STAFF001",
        hostel: "A",
        block: "Admin",
        room: "Office",
        role: "staff",
        passwordHash: "123456",
      },
      {
        name: "Hostel Warden",
        email: "warden@hostel.com",
        enrolmentNo: "WARDEN001",
        hostel: "A",
        block: "Admin",
        room: "Office",
        role: "warden",
        passwordHash: "123456",
      },
      {
        name: "System Admin",
        email: "admin@hostel.com",
        enrolmentNo: "ADMIN001",
        hostel: "Main",
        block: "Admin",
        room: "HQ",
        role: "admin",
        passwordHash: "123456",
      },
    ];

    for (let user of users) {
      await User.createWithPassword(user, user.passwordHash);
    }

    console.log("Dummy users created successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedUsers();
