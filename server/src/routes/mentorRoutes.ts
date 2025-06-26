import express from "express";
import {
  getAllMentors,
  toggleMentorApproval,
  getAllApprovedMentors,
  registerMentorWithCloudinary,
} from "../controllers/mentorController";
import { uploadFields } from "../middlewares/multer";

const router = express.Router();

router.post("/admin/register", uploadFields,registerMentorWithCloudinary );
router.post("/register", uploadFields, registerMentorWithCloudinary);
router.get("/", getAllMentors);
router.get("/approved", getAllApprovedMentors);
router.patch("/toggle-approval/:id", toggleMentorApproval);

export default router;
