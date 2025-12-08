import { Router } from "express";
import { chatController } from "../controllers/chatController";

const router = Router();

// GET /api/chat/:roomId
router.get("/:roomId", (req, res) => chatController.getMessages(req, res));

// POST /api/chat/
router.post("/", (req, res) => chatController.saveMessage(req, res));

export default router;
