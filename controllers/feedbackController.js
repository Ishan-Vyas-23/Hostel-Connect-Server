const Feedback = require("../models/Feedback");
const Complaint = require("../models/Complaint");

exports.addFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const complaintId = req.params.id;
    const userId = req.user.id;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.status !== "Resolved") {
      return res.status(400).json({
        message: "Feedback allowed only after complaint is resolved",
      });
    }

    const existing = await Feedback.findOne({
      complaint: complaintId,
      user: userId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Feedback already submitted",
      });
    }

    const feedback = await Feedback.create({
      complaint: complaintId,
      user: userId,
      rating,
      comment,
    });

    res.status(201).json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Feedback error" });
  }
};
