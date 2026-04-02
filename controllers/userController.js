const User = require("../models/User");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, hostel, enrolmentNo } = req.query;

    let filter = {};

    if (role) filter.role = role;
    if (hostel) filter.hostel = hostel;

    if (enrolmentNo) {
      filter.enrolmentNo = {
        $regex: enrolmentNo,
        $options: "i",
      };
    }

    const users = await User.find(filter).select("-passwordHash");

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { hostel, block, room, phone, year } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { hostel, block, room, phone, year },
      { returnDocument: "after" },
    ).select("-passwordHash");

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};

exports.createUserByAdmin = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      enrolmentNo,
      role,
      password,
      hostel,
      block,
      room,
      phone,
      year,
    } = req.body;

    // 🔒 basic validation
    if (!name || !username || !email || !enrolmentNo || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // ❌ check duplicates
    const existing = await User.findOne({
      $or: [{ email }, { username }, { enrolmentNo }],
    });

    if (existing) {
      return res.status(400).json({
        message: "User with email/username/enrolment already exists",
      });
    }

    // ✅ create user (IMPORTANT: use plain password, model hashes it)
    const user = await User.create({
      name,
      username,
      email,
      enrolmentNo,
      role,
      passwordHash: password, // will be hashed by pre-save hook
      hostel,
      block,
      room,
      phone,
      year,
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "User creation failed" });
  }
};
