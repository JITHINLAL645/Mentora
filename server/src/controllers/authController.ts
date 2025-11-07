import { Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { HttpStatus } from "../constants/httpStatus";
import { Messages } from "../constants/messages";
import { IAuthService } from "../interfaces/IAuthService";
import { IUserRepository } from "../interfaces/IUserRepository";
import { ISendEmail } from "../interfaces/ISendEmail";
import logger from "../utils/logger";  

export class AuthController {
  private authService: IAuthService;
  private userRepository: IUserRepository;
  private sendEmail: ISendEmail;

  constructor(
    authService: IAuthService,
    userRepository: IUserRepository,
    sendEmail: ISendEmail
  ) {
    this.authService = authService;
    this.userRepository = userRepository;
    this.sendEmail = sendEmail;
  }

  private generateAccessToken(userId: string) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
      expiresIn: "15m",
    });
  }

  private generateRefreshToken(userId: string) {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: "7d",
    });
  }

  //  REGISTER
 public register: RequestHandler = async (req, res) => {
  try {
    const user = await this.authService.registerUser(req.body);
    const otp = this.authService.generateOtp();
    await this.authService.saveOtp(user.email, otp);
    await this.sendEmail(user.email, "OTP Verification", `Your OTP is: ${otp}`);

    // Log OTP in terminal for debugging
    logger.info(`OTP for REGISTER: ${otp} sent to ${user.email}`);

    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(HttpStatus.CREATED)
      .json({
        message: Messages.REGISTER_SUCCESS,
        user,
        token: accessToken,
      });
  } catch (error: any) {
    logger.error(`Register error: ${error.message}`, { stack: error.stack });
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

  //  LOGIN
  public login: RequestHandler = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await this.authService.loginUser(email, password);

      const accessToken = this.generateAccessToken(user._id);
      const refreshToken = this.generateRefreshToken(user._id);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      logger.info(`User logged in: ${email}`);

      res.status(HttpStatus.OK).json({
        token: accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error: any) {
      logger.error(` Login error: ${error.message}`, { stack: error.stack });
      res.status(HttpStatus.UNAUTHORIZED).json({ message: error.message });
    }
  };

  //  REFRESH TOKEN
  public refreshToken: RequestHandler = async (req, res) => {
    try {
      const token = req.cookies.refreshToken;
      if (!token) return res.status(401).json({ message: "No refresh token" });

      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { id: string };
      const user = await this.userRepository.findUserById(decoded.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const newAccessToken = this.generateAccessToken(user._id);
      logger.info(`Access token refreshed for user: ${user.email}`);
      res.status(HttpStatus.OK).json({ token: newAccessToken });
    } catch (err: any) {
      logger.error("❌ Refresh token error", { stack: err.stack });
      res.status(401).json({ message: "Invalid refresh token" });
    }
  };

  //  LOGOUT
  public logoutUser: RequestHandler = async (req, res) => {
    try {
      res.clearCookie("refreshToken");
      logger.info("User logged out successfully");
      res.status(HttpStatus.OK).json({ message: Messages.LOGOUT_SUCCESS });
    } catch (err: any) {
      logger.error(" Logout error", { stack: err.stack });
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.GENERAL_ERROR });
    }
  };

  //  VERIFY OTP
  public verifyOtp: RequestHandler = async (req, res) => {
    try {
      const { email, otp } = req.body;
      const valid = await this.authService.verifyOtp(email, otp);

      if (!valid) {
        logger.warn(`Invalid OTP attempt for ${email}`);
        return res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.INVALID_OTP });
      }

      await this.userRepository.markVerified(email);
      const user = await this.userRepository.findUserByEmail(email);
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: Messages.USER_NOT_FOUND });

      const token = this.generateAccessToken(user._id);
      logger.info(` OTP verified successfully for ${email}`);

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Email verified successfully",
        token,
        user: { ...user.toObject(), verified: true },
      });
    } catch (err: any) {
      logger.error(" Verify OTP error", { stack: err.stack });
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.GENERAL_ERROR });
    }
  };

  //  RESEND OTP
  public resendOtp: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.EMAIL_REQUIRED });

    const user = await this.userRepository.findUserByEmail(email);
    if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: Messages.USER_NOT_FOUND });

    const otp = this.authService.generateOtp();
    await this.authService.saveOtp(email, otp);
    await this.sendEmail(email, "OTP Resent", `Your new OTP is: ${otp}`);

    // Log OTP in terminal
    logger.info(`OTP for RESEND: ${otp} sent to ${email}`);

    res.status(HttpStatus.OK).json({ message: Messages.OTP_RESENT });
  } catch (err: any) {
    logger.error("Resend OTP error", { stack: err.stack });
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.GENERAL_ERROR });
  }
};

  //  FORGOT PASSWORD
  public forgotPassword: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.EMAIL_REQUIRED });

    const user = await this.userRepository.findUserByEmail(email);
    if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: Messages.USER_NOT_FOUND });

    const otp = this.authService.generateOtp();
    await this.authService.saveOtp(email, otp);
    await this.sendEmail(email, "Your OTP", `Your OTP is ${otp}`);

    // Log OTP in terminal
    logger.info(`OTP for FORGOT PASSWORD: ${otp} sent to ${email}`);

    res.status(HttpStatus.OK).json({ message: "OTP sent to your email." });
  } catch (err: any) {
    logger.error("Forgot password error", { stack: err.stack });
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.GENERAL_ERROR });
  }
};

  //  RESET PASSWORD
  public resetPassword: RequestHandler = async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      if (!email || !newPassword) return res.status(HttpStatus.BAD_REQUEST).json({ message: "Email and password required" });

      const user = await this.userRepository.findUserByEmail(email);
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: Messages.USER_NOT_FOUND });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userRepository.updatePassword(email, hashedPassword);

      logger.info(` Password reset successfully for ${email}`);
      res.status(HttpStatus.OK).json({ message: Messages.PASSWORD_RESET_SUCCESS });
    } catch (err: any) {
      logger.error(" Reset password error", { stack: err.stack });
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.GENERAL_ERROR });
    }
  };
}
