export type ISendEmail = (to: string, subject: string, text: string) => Promise<void>;
