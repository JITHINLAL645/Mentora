import express from "express";
import { getMentees, toggleBlockUser } from "../controllers/menteesController";
import { getUserCount } from "../controllers/dashboardController";

const router = express.Router();

router.get("/mentees", getMentees);
router.get("/users/count", getUserCount);
router.patch("/block/:id", toggleBlockUser);

export default router;
