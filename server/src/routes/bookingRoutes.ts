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

export default router;
