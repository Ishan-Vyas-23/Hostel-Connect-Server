const Complaint = require("../models/Complaint");
const Notification = require("../models/Notification");
const Feedback = require("../models/Feedback");

exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, hostel, block, room } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location: {
        hostel,
        block,
        room,
      },
      author: req.user.id,
    });

    await Notification.create({
      user: req.user.id,
      title: "Complaint submitted",
      message: `Your complaint "${title}" was submitted successfully`,
      type: "complaint",
    });

    res.status(201).json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating complaint" });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const { sort } = req.query;

    let sortOption = { createdAt: -1 };

    if (sort === "upvotes") {
      sortOption = { upvotesCount: -1 };
    }

    if (sort === "priority") {
      sortOption = {
        upvotesCount: -1,
        createdAt: -1,
      };
    }

    const complaints = await Complaint.find({status : {$ne: "Closed"}})
      .populate("author", "name email hostel room role")
      .sort(sortOption);

    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "author",
      "name email hostel room role",
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching complaint" });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { description } = req.body;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { description },
      { returnDocument: "after" },
    );

    res.json(updatedComplaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating complaint" });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({ message: "Complaint deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting complaint" });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, resolutionText } = req.body;

    const allowedStatuses = [
      "Submitted",
      "In Progress",
      "Resolved",
      "Closed",
      "Reopened",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;

    if (resolutionText) {
      complaint.resolution = {
        by: req.user.id,
        text: resolutionText,
        date: new Date(),
      };
    }

    await complaint.save();

    await Notification.create({
      user: complaint.author,
      title: "Complaint status updated",
      message: `Your complaint "${complaint.title}" is now ${status} `,
      type: "complaint",
    });

    res.json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Status update error" });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      author: req.user.id,
    })
      .populate("author", "name email hostel room role")
      .sort({ createdAt: -1 })
      .lean();

    const complaintIds = complaints.map((c) => c._id);

    const feedbacks = await Feedback.find({
      user: req.user.id,
      complaint: { $in: complaintIds },
    }).lean();

    const feedbackMap = new Map(feedbacks.map((f) => [String(f.complaint), f]));

    const result = complaints.map((c) => ({
      ...c,
      myFeedback: feedbackMap.get(String(c._id)) || null,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching your complaints" });
  }
};
