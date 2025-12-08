import api from "./api";

export const createSlots = (data: any) => api.post("/slots/create", data);

export const getSlotsByMentor = (
  mentorId: string,
  page: number = 1,
  limit: number = 10
) =>
  api.get(`/slots/${mentorId}`, {
    params: { page, limit },
  });

export const bookSlot = (slotId: string) => api.post(`/slots/book/${slotId}`);