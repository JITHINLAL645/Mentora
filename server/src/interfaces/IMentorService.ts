export interface IMentorService {
  registerMentor(body: any, files: any): Promise<any>;
  login(email: string, password: string): Promise<any>;
  getAllMentors(): Promise<any>;
  getApprovedMentors(): Promise<any>;
  toggleApproval(id: string): Promise<any>;
  getMentorProfile(userId: string): Promise<any>;
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
  updateProfile(userId: string, data: any): Promise<any>;
  getMentorById(id: string): Promise<any>;
}
