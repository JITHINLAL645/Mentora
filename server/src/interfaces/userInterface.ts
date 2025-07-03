export interface IUser {
  _id?: string;
  email: string;
  password?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  position?: string;
  location?: string;
  about?: string;
  profileImage?: string;
  isAdmin?: boolean;
  isMentor?: boolean;
  isBlock?: boolean;
  isVerified?: boolean;
  isApproved?: boolean; 
  createdAt?: Date;
  updatedAt?: Date;
}