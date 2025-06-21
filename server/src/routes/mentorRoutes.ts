import express from "express";
import { upload } from "../middlewares/upload";
import {
  registerMentor,
  getAllMentors,
  toggleMentorApproval,
} from "../controllers/mentorController";

const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "profileImg", maxCount: 1 },
    { name: "kycCertificate", maxCount: 1 },
  ]),
  registerMentor
);

router.get("/", getAllMentors);
router.patch("/:id/toggle-approval", toggleMentorApproval);

export default router;