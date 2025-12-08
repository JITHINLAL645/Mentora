import { SlotRepository } from "../repositories/slotRepository";
import { ISlot } from "../interfaces/ISlot";

export class SlotService {
  private slotRepository: SlotRepository;

  constructor(slotRepository: SlotRepository) {
    this.slotRepository = slotRepository;
  }

  async createSlots(mentorId: string, date: string, slots: any[]) {
    if (!mentorId || !date || !slots?.length) {
      throw new Error("Invalid slot data");
    }

    const existing = await this.slotRepository.findSlotsByMentorAndDate(mentorId, date);

    const newUnique = slots.filter(
      (s) =>
        !existing.some(
          (e) => e.startTime === s.startTime && e.endTime === s.endTime
        )
    );

    if (newUnique.length === 0) {
      return { created: false, message: "No new slots to add" };
    }

    const toInsert = newUnique.map((s) => ({
      mentorId,
      date,
      startTime: s.startTime,
      endTime: s.endTime,
      isAvailable: true,
      isBooked: false,
    }));

    await this.slotRepository.model.insertMany(toInsert);
    return { created: true, message: "Slots added successfully" };
  }

  // Fixed: Removed extra { and fixed syntax
  async getSlotsByMentorPaginated(mentorId: string, skip: number, limit: number) {
    return this.slotRepository.findSlotsByMentorPaginated(mentorId, skip, limit);
  }

  // Backward compatibility (optional)
  async getSlotsByMentor(mentorId: string) {
    const { slots } = await this.slotRepository.findSlotsByMentorPaginated(mentorId, 0, 1000);
    return slots;
  }

  async bookSlot(slotId: string) {
    const slot = await this.slotRepository.findById(slotId);
    if (!slot) throw new Error("Slot not found");
    if (slot.isBooked) throw new Error("Slot already booked");

    slot.isBooked = true;
    slot.isAvailable = false;
    await this.slotRepository.updateById(slotId, slot);

    return "Slot booked successfully";
  }
}