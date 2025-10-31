import React, { useEffect, useState } from "react";
import { FaStar, FaRegClock, FaPhone, FaEnvelope } from "react-icons/fa";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Homecomponent/Navbar";
import Footer from "../../components/Homecomponent/Footer";
import { getApprovedMentors } from "../../services/mentorService";
import SlotModal from "../../components/Mentor/SlotModal";
import AppointmentConfirmModal from "../../components/Mentor/AppointmentConfirmationModal";

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

const MentorProfile: React.FC = () => {
  const [mentorData, setMentorData] = useState<IMentor | null>(null);
  const [loading, setLoading] = useState(true);

  // Slot modal states
  const [slotModalVisible, setSlotModalVisible] = useState(false);
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ISlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch mentor data
  const fetchMentor = async () => {
    try {
      const response = await getApprovedMentors();
      const mentor = response.data.data.find((m: IMentor) => m._id === id);
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
  }, [id]);

  const handleAppointmentClick = (slot: ISlot) => {
    setSelectedSlot(slot);
    setAppointmentModalVisible(true);
  };

const confirmAppointment = (slot: ISlot) => {
  if (!mentorData) {
    toast.error("Mentor data not loaded yet");
    return;
  }

  localStorage.setItem("AppointmentId", "mock-appointment-id");
  setAppointmentModalVisible(false);
  setSlotModalVisible(false);

  navigate(`/mentorCheckout/${mentorData._id}`, { state: { slot, mentorId: mentorData._id } });
};



  if (loading) {
    return (
      <div className="bg-[#F6F6F6] min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto p-6">
          <p>Loading mentor profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!mentorData) {
    return (
      <div className="bg-[#F6F6F6] min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto p-6">
          <p>Mentor not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#F6F6F6] min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        {/* Mentor Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gray-200 overflow-hidden">
            <img
              src={mentorData.profileImg || "/default-profile.png"}
              onError={(e) => (e.currentTarget.src = "/default-profile.png")}
              alt={mentorData.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{mentorData.fullName}</h1>
            <p className="text-gray-600">{mentorData.education}</p>
            <p className="text-gray-600">{mentorData.specialization}</p>
            <p className="text-gray-600">
              {mentorData.experience} years Experience
            </p>
            <div className="flex gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-sm" />
              ))}
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-gray-700">
            {mentorData.about || "No information available"}
          </p>
        </div>

        {/* Contact Section */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <FaEnvelope className="text-gray-500" />
            <span>Email: {mentorData.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaPhone className="text-gray-500" />
            <span>Phone: {mentorData.phone || "Not provided"}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaRegClock className="text-gray-500" />
            <span>Consultation fee: ₹{mentorData.consultantFee || 500}</span>
          </div>
          <span>Appointment Booking fee: ₹120</span>
          <div className="flex items-center gap-2">
            <span>
              Location: {mentorData.street}, {mentorData.city},{" "}
              {mentorData.state}
            </span>
          </div>
        </div>

        {/* Show Availability */}
        <div className="mb-8">
          <button
            className="bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
            onClick={() => setSlotModalVisible(true)}
          >
            Show Availability
          </button>
        </div>
      </div>

      {/* Slot Modal */}
      <SlotModal
        slotModalVisible={slotModalVisible}
        setSlotModalVisible={setSlotModalVisible}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        handleAppointmentClick={handleAppointmentClick}
      />

      {/* Appointment Confirm Modal */}
      {appointmentModalVisible && selectedSlot && (
        <AppointmentConfirmModal
          slot={selectedSlot}
          onConfirm={confirmAppointment}
        />
      )}

      <Footer />
    </div>
  );
};

export default MentorProfile;
