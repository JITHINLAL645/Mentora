import { Request, Response } from "express";
import { HttpStatus } from "../constants/httpStatus";
import { Messages } from "../constants/messages";
import { IDashboardService } from "../interfaces/IDashboardService";
import logger from "../utils/logger";  


export class DashboardController {
  private dashboardService: IDashboardService;

  constructor(dashboardService: IDashboardService) {
    this.dashboardService = dashboardService;
  }

  public getUserCount = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.dashboardService.getUserStats();
      res.status(HttpStatus.OK).json({
        message: Messages.FETCH_SUCCESS,
        data: stats,
      });
    } catch (error) {
      logger.error("Error fetching user counts:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: Messages.FETCH_ERROR,
      });
    }
  };
}
