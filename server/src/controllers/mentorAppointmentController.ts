import { Response } from "express";
import { MentorAppointmentService } from "../services/mentorAppointmentService";
import { HttpStatus } from "../constants/httpStatus";
import { Messages } from "../constants/messages";
import logger from "../utils/logger";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

export class MentorAppointmentController {
  private mentorAppointmentService: MentorAppointmentService;

  constructor(mentorAppointmentService: MentorAppointmentService) {
    this.mentorAppointmentService = mentorAppointmentService;
  }

  public getMentorAppointments = async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    try {
      const mentorId = req.userId;

      if (!mentorId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: Messages.MENTOR_NOT_FOUND });
      }

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 5;

      const result =
        await this.mentorAppointmentService.getMentorAppointmentsPaginated(
          mentorId,
          page,
          limit
        );

      return res.status(HttpStatus.OK).json({
        success: true,
        appointments: result.appointments,
        total: result.total,
        page,
        limit,
        message: Messages.FETCH_SUCCESS,
      });
    } catch (err) {
      logger.error("Error in getMentorAppointments:", err);

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.GENERAL_ERROR });
    }
  };
}
