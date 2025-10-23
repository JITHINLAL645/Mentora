import userRepository from "../repositories/userRepository";

class MenteeService {
  async getMentees() {
    return await userRepository.getAllMentees();
  }

  async toggleBlockUser(userId: string) {
    const user = await userRepository.toggleBlock(userId);
    if (!user) throw new Error("User not found");
    return user;
  }
}

const menteeService = new MenteeService();
export default menteeService;
