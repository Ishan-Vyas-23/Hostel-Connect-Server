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

    if (existingVote) {
      await Upvote.deleteOne({ _id: existingVote._id });

      await Complaint.findByIdAndUpdate(complaintId, {
        $inc: { upvotesCount: -1 },
      });

      return res.json({ message: "Upvote removed" });
    }

    await Upvote.create({
      user: userId,
      complaint: complaintId,
    });

    await Complaint.findByIdAndUpdate(complaintId, {
      $inc: { upvotesCount: 1 },
    });

    res.json({ message: "Complaint upvoted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upvote error" });
  }
};
