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

    if (existingVote) {
      await Upvote.deleteOne({ _id: existingVote._id });

      updatedComplaint = await Complaint.findByIdAndUpdate(
        complaintId,
        { $inc: { upvotesCount: -1 } },
        { new: true },
      );

      return res.json({
        message: "Upvote removed",
        upvotes: updatedComplaint.upvotesCount,
      });
    }

    await Upvote.create({
      user: userId,
      complaint: complaintId,
    });

    updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { $inc: { upvotesCount: 1 } },
      { new: true },
    );

    res.json({
      message: "Complaint upvoted",
      upvotes: updatedComplaint.upvotesCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upvote error" });
  }
};
