import { Request, Response } from "express";
import { HttpStatus } from "../constants/httpStatus";
import { Messages } from "../constants/messages";
import { MenteeService } from "../services/menteeService";
import logger from "../utils/logger";


export class MenteesController {
  private menteeService: MenteeService;

  constructor(menteeService: MenteeService) {
    this.menteeService = menteeService;
  }

public getMentees = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const search = (req.query.search as string) || "";

    const { users, total } = await this.menteeService.getMentees(page, limit, search);

    res.status(HttpStatus.OK).json({
      success: true,
      message: "Mentees fetched successfully",
      data: users,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    logger.error("Error fetching mentees:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch mentees",
    });
  }
};


  public toggleBlockUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      const user = await this.menteeService.toggleBlockUser(userId);
      res.status(HttpStatus.OK).json({
        message: `User ${user.isBlock ? "blocked" : "unblocked"} successfully`,
      });
    } catch (error: any) {
      if (error.message === "User not found") {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: Messages.USER_NOT_FOUND });
      } else {
        logger.error("Error toggling user block status:", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: Messages.GENERAL_ERROR,
        });
      }
    }
  };
}