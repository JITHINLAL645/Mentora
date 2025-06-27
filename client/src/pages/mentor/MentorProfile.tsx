

import { useEffect, useState } from "react";
import MentorSidebar from "../../components/Mentor/MentorSidebar";
import { getMentorProfile, updateMentorProfile, changeMentorPassword } from "../../services/mentorService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


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
  const [editForm, setEditForm] = useState({
    fullName: "",
    experience: 0,
    education: "",
    about: ""
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: ""
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMentorProfile();
         setMentor(response.data.mentor);
        setEditForm({
          fullName: response.data.mentor.fullName,
          experience: response.data.mentor.experience,
          education: response.data.mentor.education,
          about: response.data.mentor.about,
        });
      } catch (error) {
        console.error("Error fetching mentor profile:", error);
      }
    };
    fetchProfile();
  }, []);

 const handleEditSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await updateMentorProfile(editForm);
    toast.success("Profile updated successfully");

    setMentor(response.data.mentor || response.data.updatedMentor);

    setShowEditModal(false);
  } catch (error: any) {
    console.log("Update profile error:", error);
    toast.error(error.response?.data?.message || "Failed to update profile");
  }
};


  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changeMentorPassword(passwordForm);
      toast.success("Password updated successfully");
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setShowPasswordModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Password update failed");
    }
  };

  if (!mentor) return <p className="p-10">Loading profile...</p>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <MentorSidebar />
      <div className="flex-1 flex justify-center items-center p-10">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-12">
          <div className="flex items-center gap-10 border-b pb-6 mb-6">
            <img src={mentor.profileImg} alt={mentor.fullName} className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg" />
            <div>
              <h1 className="text-4xl font-bold text-gray-800">{mentor.fullName}</h1>
              <p className="text-gray-600 text-lg">{mentor.email}</p>
              <p className="text-gray-600 text-lg">{mentor.phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-lg text-gray-700">
            <p><span className="font-semibold">Specialization:</span> {mentor.specialization}</p>
            <p><span className="font-semibold">Education:</span> {mentor.education}</p>
            <p><span className="font-semibold">Gender:</span> {mentor.gender}</p>
            <p><span className="font-semibold">Experience:</span> {mentor.experience} years</p>
            <p className="col-span-2"><span className="font-semibold">About:</span> {mentor.about}</p>
            <p className="col-span-2"><span className="font-semibold">Address:</span> {mentor.street}, {mentor.city}, {mentor.state} - {mentor.pincode}</p>
          </div>

          <div className="mt-10 flex gap-6">
            <button onClick={() => setShowEditModal(true)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md">Edit Profile</button>
            <button onClick={() => setShowPasswordModal(true)} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 shadow-md">Change Password</button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
     {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            <form className="grid gap-4" onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                placeholder="Name"
                className="border p-2 rounded"
              />
              <input
                type="number"
                value={editForm.experience}
                onChange={(e) => setEditForm({ ...editForm, experience: Number(e.target.value) })}
                placeholder="Experience"
                className="border p-2 rounded"
              />
              <input
                type="text"
                value={editForm.education}
                onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
                placeholder="Education"
                className="border p-2 rounded"
              />
              <textarea
                value={editForm.about}
                onChange={(e) => setEditForm({ ...editForm, about: e.target.value })}
                placeholder="About"
                className="border p-2 rounded"
              />
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            <form className="grid gap-4" onSubmit={handlePasswordSubmit}>
              <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} placeholder="Current Password" className="border p-2 rounded" />
              <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="New Password" className="border p-2 rounded" />
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorProfile;
