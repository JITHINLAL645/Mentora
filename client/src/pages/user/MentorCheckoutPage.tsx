import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FaStar, FaRegClock, FaCreditCard, FaCheckCircle } from "react-icons/fa";
import { Toaster, toast } from "sonner";
import Navbar from "../../components/Homecomponent/Navbar";
import Footer from "../../components/Homecomponent/Footer";
import { getApprovedMentors } from "../../services/mentorService";
import { loadStripe } from "@stripe/stripe-js";

//  Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

interface IMentor {
  _id: string;
  fullName: string;
  email: string;
  profileImg: string;
  specialization: string;
  education: string;
  experience: number;
  city: string;
  street: string;
  state: string;
  gender: string;
  about?: string;
  phone?: string;
  consultantFee?: number;
}

interface ISlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked: boolean;
}

const CheckoutFormInner: React.FC<{
  mentorData: IMentor;
  selectedSlot: ISlot | null;
}> = ({ mentorData, selectedSlot }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const totalAmount = (mentorData.consultantFee || 500) + 120;

  const handleStripeCheckout = async () => {
  if (!selectedSlot) {
    toast.error("Please select a slot first");
    return;
  }

  setIsProcessing(true);
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      toast.error("Stripe not loaded");
      setIsProcessing(false);
      return;
    }

    localStorage.setItem("pendingBooking", JSON.stringify({
      mentorId: mentorData._id,
      slotId: selectedSlot._id,
      amount: totalAmount,
      currency: "inr"
    }));

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payments/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        amount: totalAmount,
        mentorId: mentorData._id,
        slotId: selectedSlot._id,
        currency: "inr",
      }),
    });

    const data = await res.json();
    if (!res.ok || (!data.sessionId && !data.url)) {
      throw new Error(data?.message || "Failed to create checkout session");
    }

    if (data.url) {
      window.location.href = data.url;
    } else {
      toast.error("Stripe session URL not received");
    }
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    toast.error(error?.message || "Payment error");
  } finally {
    setIsProcessing(false);
  }
};


  return (
    <div className="lg:col-span-1">
      <div className="bg-white shadow rounded-lg p-6 sticky top-8 space-y-4">
        <h3 className="text-lg font-semibold">Payment Summary</h3>

        <div className="flex justify-between">
          <span>Consultation Fee</span>
          <span>₹{mentorData.consultantFee || 500}</span>
        </div>
        <div className="flex justify-between">
          <span>Booking Fee</span>
          <span>₹120</span>
        </div>

        <div className="flex justify-between font-semibold text-blue-600 text-lg">
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>

        <div className="bg-white p-4 rounded">
          <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
            <input type="radio" checked readOnly />
            <FaCreditCard /> Online Payment (Stripe)
          </label>
        </div>

        <button
          className="bg-teal-600 text-white py-3 px-6 rounded-lg w-full flex items-center justify-center gap-2 hover:bg-teal-700 transition"
          onClick={handleStripeCheckout}
          disabled={isProcessing}
        >
          <FaCheckCircle />
          {isProcessing ? "Processing..." : `Pay ₹${totalAmount}`}
        </button>

        <div className="text-sm text-gray-500 text-center mt-2">
          Secure payment powered by Stripe
        </div>
      </div>
    </div>
  );
};

//  Main Mentor Checkout Page
const MentorCheckout: React.FC = () => {
  const [mentorData, setMentorData] = useState<IMentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<ISlot | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const stateSlot = (location.state as any)?.slot as ISlot | null;
  const stateMentorId = (location.state as any)?.mentorId as string | null;

  useEffect(() => {
    if (stateSlot) setSelectedSlot(stateSlot);
  }, [stateSlot]);

  const fetchMentor = async () => {
    try {
      const response = await getApprovedMentors();
      const mentorIdToUse = stateMentorId || id;
      const mentor = response.data.data.find(
        (m: IMentor) => m._id === mentorIdToUse
      );
      if (mentor) {
        setMentorData(mentor);
      } else {
        toast.error("Mentor not found");
      }
    } catch (error) {
      toast.error("Failed to load mentor data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentor();
  }, [id, stateMentorId]);

  if (loading) return <p className="p-6">Loading mentor details...</p>;
  if (!mentorData) return <p className="p-6">Mentor not found</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <Navbar />

      <div className="max-w-5xl mx-auto p-6 grid lg:grid-cols-3 gap-8">
        {/* Left side - Mentor details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-lg p-6 flex gap-4">
            <img
              src={mentorData.profileImg || "/default-profile.png"}
              alt={mentorData.fullName}
              className="w-32 h-32 object-cover rounded-full"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{mentorData.fullName}</h2>
              <p className="text-gray-600">{mentorData.education}</p>
              <p className="text-gray-600">{mentorData.specialization}</p>
              <p className="text-gray-600">
                {mentorData.experience} years experience
              </p>
              <div className="flex mt-2 gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaRegClock /> Appointment Details
            </h3>
            {selectedSlot ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Date</p>
                  <p>{new Date(selectedSlot.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Time</p>
                  <p>
                    {selectedSlot.startTime} - {selectedSlot.endTime}
                  </p>
                </div>
              </div>
            ) : (
              <p>No slot selected</p>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaCreditCard /> Payment Method
            </h3>
            <p className="text-sm text-gray-600">
              Online payment will be processed securely via Stripe checkout.
            </p>
          </div>
        </div>

        {/* Right side - Payment Summary */}
        <CheckoutFormInner mentorData={mentorData} selectedSlot={selectedSlot} />
      </div>

      <Footer />
    </div>
  );
};

export default MentorCheckout;
