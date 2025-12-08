import { BaseRepository } from "../repositories/baseRepository";
import { ChatMessage, IChatMessage } from "../models/ChatMessage";

export class ChatRepository extends BaseRepository<IChatMessage> {
  constructor() {
    super(ChatMessage);
  }

  async getMessagesByRoom(roomId: string) {
    return await ChatMessage.find({ roomId }).sort({ createdAt: 1 });
  }
}

export const chatRepository = new ChatRepository();
