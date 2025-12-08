import { User } from "../models/user";
import { Mentor } from "../models/Mentor";
import Slot from "../models/slotModel";
import { Booking } from "../models/appointmentSchemas";

import { AuthController } from "../controllers/authController";
import { AuthService } from "../services/authService";
import { AuthRepository } from "../repositories/authRepository";
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

import { SlotRepository } from "../repositories/slotRepository";
import { SlotService } from "../services/slotService";
import { SlotController } from "../controllers/slotController";

import { BookingRepository } from "../repositories/bookingRepository";
import { BookingService } from "../services/bookingService";
import { BookingController } from "../controllers/bookingController";

import { UserRepository } from "../repositories/userRepository";

import { MentorAppointmentService } from "../services/mentorAppointmentService";
import { MentorAppointmentController } from "../controllers/mentorAppointmentController";
import { MentorBookingRepository } from "../repositories/MentorBookingRepository";



const mentorBookingRepository = new MentorBookingRepository(Booking);
const mentorAppointmentService = new MentorAppointmentService(mentorBookingRepository);
const mentorAppointmentController = new MentorAppointmentController(mentorAppointmentService);

const bookingRepository = new BookingRepository(Booking);
const bookingService = new BookingService(bookingRepository);
const bookingController = new BookingController(bookingService);

const userRepository = new UserRepository(User);
const mentorRepository = new MentorRepository(Mentor);
const authRepo = new AuthRepository();

const slotRepository = new SlotRepository(Slot);
const slotService = new SlotService(slotRepository);
const slotController = new SlotController(slotService);

const authService = new AuthService(userRepository, authRepo);
const authController = new AuthController(authService, userRepository, sendEmail);

const dashboardService = new DashboardService();
const dashboardController = new DashboardController(dashboardService);

const menteeService = new MenteeService(userRepository);
const menteesController = new MenteesController(menteeService);

const mentorService = new MentorService(mentorRepository);
const mentorController = new MentorController(mentorService);

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
  slotRepository,
  slotService,
  slotController,
  bookingRepository,
  bookingService,
  bookingController,
   mentorBookingRepository,
  mentorAppointmentService,
  mentorAppointmentController,
};
