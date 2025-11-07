import express from "express";
import { paymentController } from "../di/container";

const router = express.Router();

router.post("/create-intent", paymentController.createPaymentIntent);
router.post("/create-checkout-session", paymentController.createCheckoutSession);
router.post("/finalize-booking", paymentController.finalizeBooking);

export default router;
