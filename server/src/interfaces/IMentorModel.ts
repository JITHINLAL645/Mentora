import { IMentor } from "../models/Mentor";

export interface IMentorModel {
  create(data: Partial<IMentor>): Promise<IMentor>;
  find(filter?: object): any;
  findById(id: string): Promise<IMentor | null>;
  countDocuments(filter?: object): Promise<number>;
}
