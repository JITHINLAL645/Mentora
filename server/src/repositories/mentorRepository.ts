// src/repositories/mentorRepository.ts
import { Mentor, IMentor } from "../models/Mentor";

export const createMentor = async (data: Partial<IMentor>) => {
  const mentor = new Mentor(data);
  return await mentor.save();
};
