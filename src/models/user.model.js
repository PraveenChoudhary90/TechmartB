import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Auto generated 7-char userId
    userId: {
      type: String,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    //  EMAIL (primary + secondary)
    email: {
      primary: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      secondary: {
        type: String,
        default: null,
        lowercase: true,
        trim: true,
      },
    },

    //  PHONE (primary + secondary)
    phone: {
      primary: {
        type: String,
        required: true,
        trim: true,
      },
      secondary: {
        type: String,
        default: null,
        trim: true,
      },
    },

    // city: {
    //   type: String,
    //   trim: true,
    // },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["user", "admin", "vendor", "mr"],
      default: "user",
    },

    // 🔐 OTP SYSTEM
    // otp: {
    //   code: String,
    //   expireAt: Date,
    // },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);



// 🔥 USER ID GENERATOR (7 CHAR UNIQUE)
UserSchema.pre("save", async function (next) {
  if (!this.userId) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id;
    let exists = true;

    while (exists) {
      id = "";

      for (let i = 0; i < 7; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const existing = await this.constructor.findOne({ userId: id });

      if (!existing) {
        exists = false;
      }
    }

    this.userId = id;
  }

});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;