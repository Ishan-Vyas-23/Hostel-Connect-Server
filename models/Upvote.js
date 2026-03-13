const mongoose = require("mongoose");

const upvoteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },
  },
  { timestamps: true },
);

upvoteSchema.index({ user: 1, complaint: 1 }, { unique: true });

upvoteSchema.statics.add = async function (userId, complaintId) {
  const Upvote = this;
  const Complaint = mongoose.model("Complaint");

  await Upvote.create({ user: userId, complaint: complaintId });

  await Complaint.findByIdAndUpdate(complaintId, { $inc: { upvotesCount: 1 } });
};

upvoteSchema.statics.removeByUser = async function (userId, complaintId) {
  const Upvote = this;
  const Complaint = mongoose.model("Complaint");
  const res = await Upvote.findOneAndDelete({
    user: userId,
    complaint: complaintId,
  });
  if (res) {
    await Complaint.findByIdAndUpdate(complaintId, {
      $inc: { upvotesCount: -1 },
    });
    return true;
  }
  return false;
};

module.exports = mongoose.model("Upvote", upvoteSchema);
