import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },

    // 🔥 ROLE ADDED HERE
    role: {
      type: String,
      enum: ["admin", "user"],  // you can also add vendor later if needed
      default: "user"
    },

    agreeTerms: { type: Boolean, default: false },
    agreeMarketing: { type: Boolean, default: false },

    kycStatus: {
      type: String,
      enum: ["not_submitted", "pending", "approved", "rejected"],
      default: "not_submitted",
    },

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// HASH PASSWORD
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// PASSWORD COMPARE METHOD
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("Admin", userSchema);
export default User;
