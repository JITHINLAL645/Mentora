// models/user.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email: string;
  password: string;
  otp?: string;
  otpExpiration?: Date;
  isVerified?: boolean;
  googleId?: string;
  gender?: "Male" | "Female" | "Other" | null;
  phone?: string | null;
  city?: string;
  street?: string;
  pincode?: string;
  dob?: Date;
  isBlock?: boolean;
  isAdmin?: boolean;
  age?: number;
  profileImage?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    otp: String,
    otpExpiration: Date,
    isVerified: { type: Boolean, default: false },
    googleId: String,
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", null], // null is allowed
      default: null,
      set: (v: string) => (v === "" || v == null ? null : v), // ← CRITICAL FIX
    },
    phone: { type: String, default: null },
    city: String,
    street: String,
    pincode: String,
    dob: Date,
    isBlock: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    age: Number,
    profileImage: String,
  },
  { timestamps: true }
);

// Optional: Add a pre-save hook to clean up empty strings globally if needed
userSchema.pre("save", function (next) {
  if (this.isModified("gender") && (this.gender === "" || this.gender === undefined)) {
    this.gender = null;
  }
  next();
});

export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);