import { Request, Response } from "express";
import { chatRepository } from "../repositories/chatRepository";

export class ChatController {
  async getMessages(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const messages = await chatRepository.getMessagesByRoom(roomId);
      res.json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching messages" });
    }
  }

  async saveMessage(req: Request, res: Response) {
    try {
      const { roomId, senderId, receiverId, message } = req.body;

      const saved = await chatRepository.create({
        roomId,
        senderId,
        receiverId,
        message,
      });

      res.json(saved);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error saving message" });
    }
  }
}

export const chatController = new ChatController();
