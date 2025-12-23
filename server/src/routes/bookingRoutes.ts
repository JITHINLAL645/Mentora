import express from "express";
import { bookingController } from "../di/container";
import { ensureAuthenticated } from "../middlewares/auth";

const router = express.Router();

router.patch(
  "/cancel-session/:bookingId",
  ensureAuthenticated,
  bookingController.cancelSession
);

router.get(
  "/my-sessions",
  ensureAuthenticated,
  bookingController.getMySessions
);

router.get(
  "/mentor/booked-mentees",
  ensureAuthenticated,
  bookingController.getMentorBookedMentees
);


export default router;
