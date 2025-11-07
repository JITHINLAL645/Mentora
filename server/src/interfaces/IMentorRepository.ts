import { IMentor } from "./mentorInterface";

export interface IMentorRepository {
  // CRUD operations
  create(data: Partial<IMentor>): Promise<IMentor>;
  findOne(filter: Partial<IMentor>): Promise<IMentor | null>;
  findById(id: string): Promise<IMentor | null>;
  updateById(id: string, data: Partial<IMentor>): Promise<IMentor | null>;
  deleteById(id: string): Promise<void>;

  // Custom mentor methods
  findApprovedMentors(): Promise<IMentor[]>;
  toggleApproval(id: string): Promise<IMentor | null>;
  findMentorById(id: string): Promise<IMentor | null>;
  findAllPaginated(page: number, limit: number): Promise<{ mentors: IMentor[]; total: number }>;
}
