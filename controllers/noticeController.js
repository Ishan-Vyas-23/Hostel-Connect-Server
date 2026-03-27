const Notice = require("../models/Notice");

exports.createNotice = async (req, res) => {
  try {
    const { title, content, audience } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }

    const notice = await Notice.create({
      title,
      content,
      audience: audience || "all",
      createdBy: req.user.id,
      role: req.user.role,
    });

    res.status(201).json(notice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Create notice failed" });
  }
};

exports.getAllNotices = async (req, res) => {
  try {
    const userRole = req.user?.role;

    const notices = await Notice.find({
      $or: [{ audience: "all" }, { audience: userRole }],
    })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.json(notices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fetch notices failed" });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);

    res.json({ message: "Notice deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};
