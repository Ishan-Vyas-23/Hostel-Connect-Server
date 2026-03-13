const Complaint = require("../models/Complaint");
const Feedback = require("../models/Feedback");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();

    const pending = await Complaint.countDocuments({
      status: { $in: ["Submitted", "In Progress", "Reopened"] },
    });

    const resolved = await Complaint.countDocuments({
      status: "Resolved",
    });

    const feedbacks = await Feedback.find();

    let avgRating = 0;

    if (feedbacks.length > 0) {
      const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
      avgRating = sum / feedbacks.length;
    }

    res.json({
      totalComplaints,
      pending,
      resolved,
      averageRating: avgRating.toFixed(2),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard error" });
  }
};
