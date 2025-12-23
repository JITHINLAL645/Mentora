import { Response } from "express";
import { BookingService } from "../services/bookingService";
import { AuthenticatedRequest } from "../middlewares/auth";
import { HttpStatus } from "../constants/httpStatus";
import { Messages } from "../constants/messages";
import logger from "../utils/logger";

export class BookingController {
  constructor(private bookingService: BookingService) {}

  // ================================
  // USER → MY SESSIONS
  // ================================
  getMySessions = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: Messages.USER_NOT_FOUND,
        });
      }

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;

      const { sessions, total } =
        await this.bookingService.getMySessions(userId, page, limit);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: Messages.FETCH_SUCCESS,
        sessions,
        total,
        page,
        limit,
      });
    } catch (err: any) {
      logger.error("Error in getMySessions:", err);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: Messages.GENERAL_ERROR,
        error: err.message,
      });
    }
  };

  // ================================
  // USER → CANCEL SESSION
  // ================================
  cancelSession = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const bookingId = req.params.bookingId;
      const userId = req.userId;

      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: Messages.USER_NOT_FOUND,
        });
      }

      const result = await this.bookingService.cancelSession(
        bookingId,
        userId
      );

      return res.status(HttpStatus.OK).json({
        success: true,
        message: Messages.SESSION_CANCELLED,
        session: result,
      });
    } catch (err: any) {
      logger.error("Error in cancelSession:", err);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: err.message || Messages.GENERAL_ERROR,
      });
    }
  };

  // ================================
  // MENTOR → BOOKED MENTEES (CHAT)
  // ================================
  getMentorBookedMentees = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<Response> => {
    try {
      const mentorId = req.userId; // mentorId from JWT

      if (!mentorId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: Messages.USER_NOT_FOUND,
        });
      }

      const mentees =
        await this.bookingService.getBookedMenteesForMentor(mentorId);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: Messages.FETCH_SUCCESS,
        mentees,
      });
    } catch (err: any) {
      logger.error("Error in getMentorBookedMentees:", err);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: err.message || Messages.GENERAL_ERROR,
      });
    }
  };
}
