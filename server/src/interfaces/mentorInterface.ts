import { IUser } from './userInterface';

export interface IMentor extends IUser {
  profileImg?: string;
  kycCertificate?: string;
  experience?: number;
  availableDays?: string[];
  specialization?: string;
  isApproved?: boolean;
}