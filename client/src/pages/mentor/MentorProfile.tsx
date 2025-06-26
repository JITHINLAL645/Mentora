import { useEffect, useState } from "react";
import MentorSidebar from "../../components/Mentor/MentorSidebar";
import { getMentorProfile } from "../../services/mentorService";
import { useNavigate } from "react-router-dom";

interface MentorProfileType {
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  education: string;
  gender: string;
  experience: number;
  profileImg: string;
  about: string;
  city: string;
  street: string;
  state: string;
  pincode: string;
}

const MentorProfile = () => {
  const [mentor, setMentor] = useState<MentorProfileType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMentorProfile();
        setMentor(response.data.mentor);
      } catch (error) {
        console.error("Error fetching mentor profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!mentor) return <p className="p-10">Loading profile...</p>;

  return (
    <div className="flex  min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <MentorSidebar />

      <div className="flex-1 flex justify-center  items-center p-10 ">
        <div className="w-full h-160 max-w-6xl bg-white rounded-3xl shadow-2xl p-12">
          {/* Profile Header */}
          <div className="flex items-center gap-10 border-b pb-6 mb-6">
            <img
              src={mentor.profileImg}
              alt={mentor.fullName}
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            />
            <div>
              <h1 className="text-4xl font-bold text-gray-800">{mentor.fullName}</h1>
              <p className="text-gray-600 text-lg">{mentor.email}</p>
              <p className="text-gray-600 text-lg">{mentor.phone}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-lg text-gray-700 mt-15">
            
            <p><span className="font-semibold">Specialization:</span> {mentor.specialization}</p>
            <p><span className="font-semibold">Education:</span> {mentor.education}</p>
            <p><span className="font-semibold">Gender:</span> {mentor.gender}</p>
            <p><span className="font-semibold">Experience:</span> {mentor.experience} years</p>
            <p className="col-span-2">
              <span className="font-semibold">About:</span> {mentor.about}
            </p>
            <p className="col-span-2">
              <span className="font-semibold">Address:</span> {mentor.street}, {mentor.city}, {mentor.state} - {mentor.pincode}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-6 mt-20">
            <button
              onClick={() => navigate("/mentor/edit-profile")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate("/mentor/change-password")}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 shadow-md"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorProfile;
