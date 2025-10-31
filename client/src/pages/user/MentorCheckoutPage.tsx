import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  FaStar,
  FaRegClock,
  FaWallet,
  FaCreditCard,
  FaCheckCircle,
} from "react-icons/fa";
import { Toaster, toast } from "sonner";
import Navbar from "../../components/Homecomponent/Navbar";
import Footer from "../../components/Homecomponent/Footer";
import { getApprovedMentors } from "../../services/mentorService";

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

const MentorCheckout: React.FC = () => {
  const [mentorData, setMentorData] = useState<IMentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<ISlot | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // Retrieve slot and mentorId from state if passed
  const stateSlot = location.state?.slot as ISlot | null;
  const stateMentorId = location.state?.mentorId as string | null;

  useEffect(() => {
    if (stateSlot) setSelectedSlot(stateSlot);
  }, [stateSlot]);

  // Fetch mentor
  const fetchMentor = async () => {
    try {
      const response = await getApprovedMentors();
      const mentorIdToUse = stateMentorId || id;
      const mentor = response.data.data.find((m: IMentor) => m._id === mentorIdToUse);
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

  const handlePayment = async () => {
    if (!selectedSlot) {
      toast.error("Please select a slot first");
      return;
    }
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    const totalAmount = (mentorData?.consultantFee || 500) + 120; 

    if (paymentMethod === "Online Payment") {
      // Razorpay integration example
      const options = {
        key: "rzp_test_REa5si7xp8OFdl",
        amount: totalAmount * 100,
        currency: "INR",
        name: "Mentor Booking",
        description: "Appointment Payment",
        handler: function (response: any) {
          console.log("Payment success", response);
          toast.success("Payment Successful!");
          navigate("/appointment_booking");
        },
        prefill: {
          name: "Patient Name",
          email: "patient@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } else {
      // Wallet payment simulation
      toast.success(`Wallet payment of ₹${totalAmount} successful!`);
      navigate("/appointment_booking");
    }
  };

  if (loading) return <p className="p-6">Loading mentor details...</p>;
  if (!mentorData) return <p className="p-6">Mentor not found</p>;

  const totalAmount = (mentorData.consultantFee || 500) + 120;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 grid lg:grid-cols-3 gap-8">
        {/* Booking Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mentor Info */}
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

          {/* Slot Details */}
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

          {/* Payment Method */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaCreditCard /> Payment Method
            </h3>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="Online Payment"
                  checked={paymentMethod === "Online Payment"}
                  onChange={() => setPaymentMethod("Online Payment")}
                />
                <FaCreditCard /> Online Payment
              </label>

              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="Wallet"
                  checked={paymentMethod === "Wallet"}
                  onChange={() => setPaymentMethod("Wallet")}
                />
                <FaWallet /> Wallet Payment
              </label>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
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

            <button
              className="bg-teal-600 text-white py-3 px-6 rounded-lg w-full flex items-center justify-center gap-2 hover:bg-teal-700 transition"
              onClick={handlePayment}
            >
              <FaCheckCircle /> Confirm & Pay ₹{totalAmount}
            </button>

            <div className="text-sm text-gray-500 text-center mt-2">
              Secure payment powered by SSL encryption
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MentorCheckout;
