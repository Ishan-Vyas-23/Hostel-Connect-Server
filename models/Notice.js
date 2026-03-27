const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "warden", "staff"],
      required: true,
    },

    audience: {
      type: String,
      enum: ["all", "resident", "staff", "warden"],
      default: "all",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notice", noticeSchema);
