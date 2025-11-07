export interface IDashboardService {
  getUserStats(): Promise<{
    totalMentees: number;
    blockedMentees: number;
    totalMentors: number;
  }>;
}
