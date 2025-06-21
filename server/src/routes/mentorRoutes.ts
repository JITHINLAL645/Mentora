// routes/mentorRoutes.ts
import express from "express";
import { upload } from "../middlewares/upload"; 
import { registerMentor } from "../controllers/mentorController";

const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "profileImg", maxCount: 1 },
    { name: "kycCertificate", maxCount: 1 },
  ]),
  registerMentor
);

export default router;
