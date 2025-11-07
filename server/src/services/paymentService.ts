import { stripe } from "../config/stripe";
import { PaymentRepository } from "../repositories/paymentRepository";

const paymentRepo = new PaymentRepository();

export class PaymentService {
  async createPaymentIntent({
    amountInINR,
    currency = "inr",
    metadata = {},
  }: {
    amountInINR: number;
    currency?: string;
    metadata?: Record<string, string>;
  }) {
    const amountInPaise = Math.round(amountInINR * 100);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPaise,
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });
    return paymentIntent;
  }

  async finalizeBooking({
    mentorId,
    slotId,
    userId,
    paymentIntentId,
  }: {
    mentorId: string;
    slotId: string;
    userId?: string;
    paymentIntentId: string;
  }) {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (intent.status !== "succeeded") {
      throw new Error("Payment not successful");
    }

    const booking = await paymentRepo.markSlotBooked({
      mentorId,
      slotId,
      userId,
      paymentIntentId,
    });
    return booking;
  }
}
