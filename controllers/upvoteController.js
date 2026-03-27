const Upvote = require("../models/Upvote");
const Complaint = require("../models/Complaint");

exports.toggleUpvote = async (req, res) => {
  try {
    const userId = req.user.id;
    const complaintId = req.params.id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const existingVote = await Upvote.findOne({
      user: userId,
      complaint: complaintId,
    });

    let upvoted;

    if (existingVote) {
      await Upvote.deleteOne({ _id: existingVote._id });

      complaint.upvotesCount = Math.max(0, complaint.upvotesCount - 1);
      upvoted = false;
    } else {
      await Upvote.create({
        user: userId,
        complaint: complaintId,
      });

      complaint.upvotesCount += 1;
      upvoted = true;
    }

    // ✅ SEVERITY LOGIC (clean + predictable)
    let severity = "low";

    if (complaint.upvotesCount >= 6) {
      severity = "high";
    } else if (complaint.upvotesCount >= 3) {
      severity = "medium";
    }

    complaint.severity = severity;

    await complaint.save();

    res.json({
      message: upvoted ? "Complaint upvoted" : "Upvote removed",
      upvotes: complaint.upvotesCount,
      upvoted,
      severity: complaint.severity,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upvote error" });
  }
};
