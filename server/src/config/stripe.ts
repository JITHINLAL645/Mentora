import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment");
}

export const stripe = new Stripe(secretKey, { apiVersion: "2022-11-15" });
