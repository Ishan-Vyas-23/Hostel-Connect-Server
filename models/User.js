const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
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
  },
  { timestamps: true },
);

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("passwordHash")) return next();
//   // assume passwordHash currently contains plain password when creating user via code:
//   // set user.passwordHash = plaintextPassword before save OR use helper below
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
//     return next();
//   } catch (err) {
//     return next(err);
//   }
// });

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

module.exports = mongoose.model("User", userSchema);
