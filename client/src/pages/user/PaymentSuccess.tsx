import { useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../../components/Homecomponent/Navbar";

const PaymentSuccess = () => {
  const hasFinalized = useRef(false); // ✅ ensures only one call

  useEffect(() => {
    const finalizeBooking = async () => {
      if (hasFinalized.current) return; // prevent multiple calls
      hasFinalized.current = true;

      try {
        const storedData = localStorage.getItem("pendingBooking");
        if (!storedData) return;

        const bookingData = JSON.parse(storedData);
        const sessionId = new URLSearchParams(window.location.search).get("session_id");
        if (!sessionId) return;

        console.log("📤 Sending finalizeBooking request:", {
          mentorId: bookingData.mentorId,
          slotId: bookingData.slotId,
          userId: localStorage.getItem("userId"),
          sessionId,
        });

        const res = await axios.post("http://localhost:5000/api/payments/finalize-booking", {
          mentorId: bookingData.mentorId,
          slotId: bookingData.slotId,
          userId: localStorage.getItem("userId"),
          sessionId,
        });

        console.log("✅ Booking finalized successfully:", res.data);
        localStorage.removeItem("pendingBooking");
      } catch (err) {
        console.error("❌ Error finalizing booking:", err);
      }
    };

    finalizeBooking();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
        <h1 className="text-3xl font-bold text-green-700">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-700 mt-2">
          Your mentor session has been booked successfully.
        </p>
      </div>
    </>
  );
};

export default PaymentSuccess;
