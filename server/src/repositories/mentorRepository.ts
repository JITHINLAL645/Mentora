import { Mentor, IMentor } from "../models/Mentor";

export const createMentor = async (data: Partial<IMentor>) => {
  const mentor = new Mentor(data);
  return await mentor.save();
};

export const findAllMentors = async () => {
  return await Mentor.find();
};

export const findMentorById = async (id: string) => {
  return await Mentor.findById(id);
};