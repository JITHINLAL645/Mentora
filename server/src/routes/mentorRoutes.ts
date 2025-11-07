import express from "express";
import { mentorController } from "../di/container";
import { uploadFields } from "../middlewares/multer";
import { ensureAuthenticated } from "../middlewares/auth";

const router = express.Router();

// Registration
router.post("/admin/register", uploadFields, mentorController.registerMentorWithCloudinary);
router.post("/register", uploadFields, mentorController.registerMentorWithCloudinary);

// Get all mentors + approved mentors
router.get("/", mentorController.getAllMentors);
router.get("/approved", mentorController.getAllApprovedMentors);

// Toggle approval (admin)
router.patch("/toggle-approval/:id", mentorController.toggleMentorApproval);

// Login
router.post("/login", mentorController.mentorLogin);

// Mentor profile & update routes
router.get("/mentorprofile", ensureAuthenticated, mentorController.getMentorProfileController);
router.put("/change-password", ensureAuthenticated, mentorController.changeMentorPassword);
router.put("/update-profile", ensureAuthenticated, mentorController.updateMentorProfileController);

// Get single mentor by ID
router.get("/getMentorById/:id", mentorController.getMentorByIdController);

export default router;
