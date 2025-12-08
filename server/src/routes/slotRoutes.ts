import express from "express";
import { slotController } from "../di/container";

const router = express.Router();

// Create slot
router.post("/create", (req, res) => slotController.createSlots(req, res));

// Get slots by mentor
router.get("/:mentorId", (req, res) => slotController.getSlotsByMentor(req, res));

// Book slot
router.patch("/book/:slotId", (req, res) => slotController.bookSlot(req, res));


export default router;
