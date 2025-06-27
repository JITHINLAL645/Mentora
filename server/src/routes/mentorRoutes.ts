import express from "express";
import {
  getAllMentors,
  toggleMentorApproval,
  getAllApprovedMentors,
  registerMentorWithCloudinary,
  mentorLogin,
  getMentorProfileController,
  updateMentorProfile,
  changeMentorPassword
} from "../controllers/mentorController";
import { uploadFields } from "../middlewares/multer";
import { authenticate } from "../middlewares/auth"; 


const router = express.Router();

router.post("/admin/register", uploadFields,registerMentorWithCloudinary );
router.post("/register", uploadFields, registerMentorWithCloudinary);
router.get("/", getAllMentors);
router.get("/approved", getAllApprovedMentors);
router.patch("/toggle-approval/:id", toggleMentorApproval);
router.post("/login", mentorLogin);
router.get("/mentorprofile", authenticate, getMentorProfileController);

router.put("/update-profile", authenticate, updateMentorProfile);
router.put("/change-password", authenticate, changeMentorPassword);





export default router;
