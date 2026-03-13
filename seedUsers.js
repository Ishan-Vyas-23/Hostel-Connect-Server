// seedUsers.js
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

function randomNumberString(len = 4) {
  return Math.floor(Math.random() * Math.pow(10, len))
    .toString()
    .padStart(len, "0");
}

function usernameForRole(role) {
  // prefixes: resident -> std, staff -> stf, warden -> wdn, admin -> adm
  if (role === "resident") return `std${randomNumberString(4)}`;
  if (role === "staff") return `stf${randomNumberString(4)}`;
  if (role === "warden") return `wdn${randomNumberString(4)}`;
  if (role === "admin") return `adm${randomNumberString(4)}`;
  return `user${randomNumberString(4)}`;
}

async function generateUniqueUsername(role) {
  let tries = 0;
  while (tries < 10) {
    const uname = usernameForRole(role);
    const exists = await User.findOne({ username: uname });
    if (!exists) return uname;
    tries++;
  }
  // fallback (extremely unlikely)
  return `${usernameForRole(role)}${Date.now().toString().slice(-4)}`;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI_HOSTEL_CONNECT);
    console.log("Connected to MongoDB");

    // WARNING: This removes existing users (keep backups if needed)
    await User.deleteMany({});

    const raw = [
      {
        name: "Ishan Vyas",
        email: "ishan23vyas@gmail.com",
        enrolmentNo: "0801CS241066",
        hostel: "A",
        block: "A",
        room: "301",
        role: "resident",
        year: "2nd",
        password: "123456",
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
        password: "123456",
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
        password: "123456",
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
        password: "123456",
      },
      {
        name: "Jyotirbhanu",
        email: "jyotirbhanusharma@gmail.com",
        enrolmentNo: "0801CS241070",
        hostel: "A",
        block: "B",
        room: "306",
        role: "resident",
        year: "2nd",
        password: "123456",
      },
      {
        name: "Hostel Staff",
        email: "staff@hostel.com",
        enrolmentNo: "STAFF001",
        hostel: "A",
        block: "Admin",
        room: "Office",
        role: "staff",
        password: "123456",
      },
      {
        name: "Hostel Warden",
        email: "warden@hostel.com",
        enrolmentNo: "WARDEN001",
        hostel: "A",
        block: "Admin",
        room: "Office",
        role: "warden",
        password: "123456",
      },
      {
        name: "System Admin",
        email: "admin@hostel.com",
        enrolmentNo: "ADMIN001",
        hostel: "Main",
        block: "Admin",
        room: "HQ",
        role: "admin",
        password: "123456",
      },
    ];

    for (const u of raw) {
      const username = await generateUniqueUsername(u.role);
      const userObj = {
        name: u.name,
        username,
        email: u.email,
        enrolmentNo: u.enrolmentNo,
        hostel: u.hostel,
        block: u.block,
        room: u.room,
        role: u.role,
        year: u.year,
      };
      // createWithPassword expects plain password as second arg
      await User.createWithPassword(userObj, u.password);
      console.log(`Created ${u.name} -> ${username}`);
    }

    console.log("Dummy users created successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
