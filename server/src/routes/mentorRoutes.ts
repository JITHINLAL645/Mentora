import express from "express";
import {
  mentorController,
  mentorAppointmentController,
  bookingController,
} from "../di/container";
import { uploadFields } from "../middlewares/multer";
import { ensureAuthenticated } from "../middlewares/auth";

const router = express.Router();

router.post("/admin/register", uploadFields, mentorController.registerMentorWithCloudinary);
router.post("/register", uploadFields, mentorController.registerMentorWithCloudinary);

// ========== Mentor Listing 
router.get("/", mentorController.getAllMentors);
router.get("/approved", mentorController.getAllApprovedMentors);
router.get("/filtered", mentorController.getFilteredMentors);

router.patch("/toggle-approval/:id", mentorController.toggleMentorApproval);
router.post("/reject/:id", mentorController.rejectMentor);

router.post("/login", mentorController.mentorLogin);

router.get("/mentorprofile", ensureAuthenticated, mentorController.getMentorProfileController);
router.put("/change-password", ensureAuthenticated, mentorController.changeMentorPassword);
router.put("/update-profile", ensureAuthenticated, mentorController.updateMentorProfileController);

router.get("/getMentorById/:id", mentorController.getMentorByIdController);

router.get(
  "/bookings/my-appointments",
  ensureAuthenticated,
  mentorAppointmentController.getMentorAppointments
);

router.patch(
  "/cancel-session/:bookingId",
  ensureAuthenticated,
  bookingController.cancelSession
);

export default router;
