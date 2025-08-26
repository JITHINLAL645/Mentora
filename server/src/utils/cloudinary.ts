import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config();

// ✅ Configure Cloudinary with .env values
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload function
export const uploadToCloudinary = async (
  filePath: string,
  folder: string = "mentors"
): Promise<{ url: string; public_id: string }> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error: any) {
    console.error("🔥 Cloudinary Upload Error 🔥");
    console.error("Message:", error.message);
    console.error("Full Error:", error);
    throw new Error("Cloudinary upload failed");
  }
};


export default cloudinary;
