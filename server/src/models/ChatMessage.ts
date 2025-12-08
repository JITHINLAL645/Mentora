import mongoose, { Document, Schema } from "mongoose";

export interface IChatMessage extends Document {
  roomId: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    roomId: { type: String, required: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const ChatMessage = mongoose.model<IChatMessage>(
  "ChatMessage",
  ChatMessageSchema
);
