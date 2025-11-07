import { IUserRepository } from "../interfaces/IUserRepository";

export class MenteeService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async getMentees(page: number, limit: number, search?: string) {
  return await this.userRepository.getAllMentees(page, limit, search);
}


  async toggleBlockUser(userId: string) {
    const user = await this.userRepository.toggleBlock(userId);
    if (!user) throw new Error("User not found");
    return user;
  }
}
