import Swal from "sweetalert2";

interface ISlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked: boolean;
}

interface AppointmentConfirmationModalProps {
  slot: ISlot;
  onConfirm: (slot: ISlot) => void;
}

const AppointmentConfirmationModal = ({ slot, onConfirm }: AppointmentConfirmationModalProps) => {
  Swal.fire({
    title: "Confirm Appointment?",
    text: `You are about to book an appointment on ${new Date(
      slot.date
    ).toLocaleDateString()} at ${slot.startTime} - ${slot.endTime}.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, book it!",
    cancelButtonText: "No, close",
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm(slot);
    }
  });

  return null; 
};

export default AppointmentConfirmationModal;
