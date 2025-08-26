
import mongoose, { Schema, Document } from "mongoose";

export interface IMentor extends Document {
  fullName: string;
  email: string;
  password: string;
  specialization: string;
  education: string;
  gender: "Male" | "Female" | "Other";
  experience: number;
  profileImg: string; 
  phone: string;
  about: string;
  kycCertificate: string; 
  availableDays: string[];
  isVerified: boolean;
  isApproved: boolean;
  reviewCount: number;
  rating: number;
  city: string;
  street: string;
  state: string;
  pincode: string;
  otp?: string;
  otpExpiration?: Date;
  absentDays?: Date[];
  createdAt?: Date;

  updatedAt?: Date;
  role?: "mentor";
  deleted?: boolean; 
}

const mentorSchema = new Schema<IMentor>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    education: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    experience: { type: Number, required: true },
    profileImg: { type: String, required: true },
    phone: { type: String, required: true },
    about: { type: String, required: true },
    kycCertificate: { type: String, required: true },
    availableDays: { type: [String], required: true },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: true },
    reviewCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    city: { type: String, required: true },
    street: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    otp: { type: String },
    otpExpiration: { type: Date },
    absentDays: { type: [Date] },
    deleted: { type: Boolean, default: false },
    role: { type: String, default: "mentor" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Mentor = mongoose.models.Mentor || mongoose.model<IMentor>("Mentor", mentorSchema);
