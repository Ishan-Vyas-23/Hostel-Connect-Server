const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, default: "general", trim: true },
    location: {
      hostel: { type: String, trim: true },
      block: { type: String, trim: true },
      room: { type: String, trim: true },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Submitted", "In Progress", "Resolved", "Closed", "Reopened"],
      default: "Submitted",
    },
    severity: { type: String, enum: ["low", "medium", "high"], default: "low" },
    upvotesCount: { type: Number, default: 0 },

    resolution: {
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String },
      date: { type: Date },
    },
  },
  { timestamps: true },
);

complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ upvotesCount: -1, createdAt: -1 });

module.exports = mongoose.model("Complaint", complaintSchema);
