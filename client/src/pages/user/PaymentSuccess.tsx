import { useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../../components/Homecomponent/Navbar";

const PaymentSuccess = () => {
  const hasFinalized = useRef(false);

  useEffect(() => {
    const finalizeBooking = async () => {
      if (hasFinalized.current) return; // Avoid multiple calls
      hasFinalized.current = true;

      try {
        const storedData = localStorage.getItem("pendingBooking");
        if (!storedData) return;

        const bookingData = JSON.parse(storedData);
        const sessionId = new URLSearchParams(window.location.search).get("session_id");
        if (!sessionId) return;

        const payload = {
          mentorId: bookingData.mentorId,
          slotId: bookingData.slotId,
          userId: localStorage.getItem("userId"),
          sessionId,
        };

        await axios.post(
          "http://localhost:5000/api/payments/finalize-booking",
          payload
        );

        await axios.patch(
          `http://localhost:5000/api/slots/book/${bookingData.slotId}`
        );

        localStorage.removeItem("pendingBooking");
      } catch (err) {
        console.error("Error finalizing booking:", err);
      }
    };

    finalizeBooking();
  }, []);

  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4 text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-4">Payment Successful 🎉</h1>
        <p className="text-gray-700 mb-6 text-lg">
          Your mentor session has been booked successfully.
        </p>
        <a
          href="/sessions"
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded transition-colors"
        >
          Go to My Sessions
        </a>
      </div>
    </>
  );
};

export default PaymentSuccess;
