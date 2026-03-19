const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    enrolmentNo: { type: String, required: true, unique: true, trim: true },
    hostel: { type: String, trim: true },
    block: { type: String, trim: true },
    room: { type: String, trim: true },
    phone: { type: String, trim: true },
    year: { type: String, trim: true },
    profilePhotoUrl: { type: String, default: null },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["resident", "staff", "warden", "admin"],
      default: "resident",
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) return;
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

userSchema.methods.verifyPassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

userSchema.statics.createWithPassword = async function (
  userObj,
  plainPassword,
) {
  const tmp = { ...userObj, passwordHash: plainPassword };
  return this.create(tmp);
};

userSchema.methods.setPassword = async function (password) {
  this.passwordHash = password;
};

module.exports = mongoose.model("User", userSchema);
