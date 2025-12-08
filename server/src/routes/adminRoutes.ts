import express from "express";
import { menteesController, dashboardController } from "../di/container";
import { ensureAuthenticated } from "../middlewares/auth";
import { isAdmin } from "../middlewares/isAdmin";

const router = express.Router();

router.get("/mentees", ensureAuthenticated, isAdmin, menteesController.getMentees);
router.get("/users/count", ensureAuthenticated, isAdmin, dashboardController.getUserCount);
router.patch("/block/:id", ensureAuthenticated, isAdmin, menteesController.toggleBlockUser);

export default router;
