import { Request, Response } from "express";
import { PaymentService } from "../services/paymentService";
import { HttpStatus } from "../constants/httpStatus";
import { Messages } from "../constants/messages";
import Stripe from "stripe";
import logger from "../utils/logger";

export class PaymentController {
  private paymentService: PaymentService;
  private stripe: Stripe;

  constructor(paymentService: PaymentService) {
    this.paymentService = paymentService;
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2024-06-20" as any,
    });
  }

  public createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { amountInINR, currency, metadata } = req.body;

      if (!amountInINR) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.AMOUNT_REQUIRED });
        return;
      }

      const intent = await this.paymentService.createPaymentIntent({
        amountInINR,
        currency,
        metadata,
      });

      res.status(HttpStatus.OK).json({
        clientSecret: intent.client_secret,
        paymentIntentId: intent.id,
      });
    } catch (error: any) {
      logger.error("createPaymentIntent error:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  };

  public createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const { amount, mentorId, slotId, currency } = req.body;

      if (!amount) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.AMOUNT_REQUIRED });
        return;
      }

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: currency || "inr",
              product_data: {
                name: "Mentor Consultation",
                description: `Mentor ID: ${mentorId}`,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-failed`,
        metadata: { mentorId, slotId },
      });

      res.status(HttpStatus.OK).json({
        sessionId: session.id,
        url: session.url,
      });
    } catch (error: any) {
      logger.error("createCheckoutSession error:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || Messages.CHECKOUT_SESSION_FAILED,
      });
    }
  };

  public finalizeBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const { mentorId, slotId, userId, sessionId } = req.body;

      if (!mentorId || !slotId || !sessionId) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.MISSING_REQUIRED_FIELDS });
        return;
      }

      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== "paid") {
        throw new Error(Messages.PAYMENT_NOT_SUCCESSFUL);
      }

      const paymentIntentId = session.payment_intent as string;

      const booking = await this.paymentService.finalizeBooking({
        mentorId,
        slotId,
        userId,
        paymentIntentId,
      });

      res.status(HttpStatus.OK).json({
        message: Messages.BOOKING_FINALIZED_SUCCESS,
        booking,
      });
    } catch (error: any) {
      logger.error("finalizeBooking error:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  };
}
