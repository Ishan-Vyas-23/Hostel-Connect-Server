const Upvote = require("../models/Upvote");
const Complaint = require("../models/Complaint");

exports.toggleUpvote = async (req, res) => {
  try {
    const userId = req.user.id;
    const complaintId = req.params.id;

    const existingVote = await Upvote.findOne({
      user: userId,
      complaint: complaintId,
    });

    let updatedComplaint;
    let upvoted;

    if (existingVote) {
      await Upvote.deleteOne({ _id: existingVote._id });

      updatedComplaint = await Complaint.findByIdAndUpdate(
        complaintId,
        { $inc: { upvotesCount: -1 } },
        { returnDocument: "after" },
      );

      upvoted = false;
    } else {
      await Upvote.create({
        user: userId,
        complaint: complaintId,
      });

      updatedComplaint = await Complaint.findByIdAndUpdate(
        complaintId,
        { $inc: { upvotesCount: 1 } },
        { returnDocument: "after" },
      );

      upvoted = true;
    }

    let severity = "low";

    if (updatedComplaint.upvotesCount >= 6) {
      severity = "high";
    } else if (updatedComplaint.upvotesCount >= 3) {
      severity = "medium";
    }

    if (updatedComplaint.severity !== severity) {
      updatedComplaint.severity = severity;
      await updatedComplaint.save();
    }

    res.json({
      message: upvoted ? "Complaint upvoted" : "Upvote removed",
      upvotes: updatedComplaint.upvotesCount,
      upvoted: upvoted,
      severity: updatedComplaint.severity,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upvote error" });
  }
};
