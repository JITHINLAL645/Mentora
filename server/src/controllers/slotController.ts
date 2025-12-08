import { Request, Response } from "express";
import { SlotService } from "../services/slotService";
import { HttpStatus } from "../constants/httpStatus";
import { Messages } from "../constants/messages";
import logger from "../utils/logger";

export class SlotController {
  private slotService: SlotService;

  constructor(slotService: SlotService) {
    this.slotService = slotService;
  }

  createSlots = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { mentorId, date, slots } = req.body;
      const result = await this.slotService.createSlots(mentorId, date, slots);
      return res
        .status(result.created ? HttpStatus.CREATED : HttpStatus.OK)
        .json({ message: result.message });
    } catch (error: any) {
      logger.error("Slot creation error:", error.message);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SERVER_ERROR });
    }
  };

  // Updated with pagination
  getSlotsByMentor = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { mentorId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // console.log("Fetching slots for mentor:", mentorId, { page, limit });

      const { slots, total } = await this.slotService.getSlotsByMentorPaginated(
        mentorId,
        skip,
        limit
      );

      return res.status(HttpStatus.OK).json({
        slots,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      });
    } catch (err: any) {
      logger.error("getSlotsByMentor error:", err);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to fetch slots" });
    }
  };

  bookSlot = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { slotId } = req.params;
      const message = await this.slotService.bookSlot(slotId);
      return res.status(HttpStatus.OK).json({ message });
    } catch (err: any) {
      logger.error("Slot booking error:", err.message);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: Messages.SLOT_BOOKING_FAILED });
    }
  };
}