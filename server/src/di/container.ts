import { AuthController } from "../controllers/authController";
import { AuthService } from "../services/authService";
import { AuthRepository } from "../repositories/authRepository";
import userRepository from "../repositories/userRepository";
import { sendEmail } from "../utils/sendEmail";

import { DashboardService } from "../services/dashboardService";
import { DashboardController } from "../controllers/dashboardController";

import { MenteeService } from "../services/menteeService";
import { MenteesController } from "../controllers/menteesController";

import { MentorRepository } from "../repositories/mentorRepository";
import { MentorService } from "../services/mentorService";
import { MentorController } from "../controllers/mentorController";

import { PaymentService } from "../services/paymentService";
import { PaymentController } from "../controllers/paymentController";

// Auth
const authRepo = new AuthRepository();
const authService = new AuthService(userRepository, authRepo);
const authController = new AuthController(authService, userRepository, sendEmail);

// Dashboard
const dashboardService = new DashboardService();
const dashboardController = new DashboardController(dashboardService);

// Mentee
const menteeService = new MenteeService(userRepository);
const menteesController = new MenteesController(menteeService);

// Mentor
const mentorRepository = new MentorRepository();
const mentorService = new MentorService(mentorRepository);
const mentorController = new MentorController(mentorService);

// Payment
const paymentService = new PaymentService();
const paymentController = new PaymentController(paymentService);


export {
  authController,
  authService,
  authRepo,
  dashboardService,
  dashboardController,
  menteeService,
  menteesController,
  mentorRepository,
  mentorService,
  mentorController,
  paymentService,
  paymentController,
};
