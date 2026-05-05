import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
    },

    expireAt: {
      type: Date,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// auto delete expired OTP
OTPSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("OTP", OTPSchema);