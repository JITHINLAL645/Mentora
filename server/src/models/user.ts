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
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    otp: String,
    otpExpiration: Date,
    isVerified: { type: Boolean, default: false },
    googleId: String,
    gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
    phone: { type: String, default: null },
    city: String,
    street: String,
    pincode: String,
    dob: Date,
    isBlock: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    age: Number,
    profileImage: {
      type: String,
      default:
        "https://res.cloudinary.com/danyvuvkm/image/upload/v1742640347/vecteezy_default-profile-account-unknown-icon-black-silhouette_20765399_cdpbr4.jpg",
    },
  },
  { timestamps: true }
);

// ✅ Important line to prevent OverwriteModelError
export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
