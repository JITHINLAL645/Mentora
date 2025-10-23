import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoPencil } from "react-icons/go";
import { EllipsisVertical } from "lucide-react";
import Footer from "../../components/Homecomponent/Footer";
import Navbar from "../../components/Homecomponent/Navbar";
import ConfirmModal from "../../components/Mentor/ConfirmModal";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  gender?: string;
  phone?: string;
  city?: string;
  about?: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAbout, setEditingAbout] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    phone: "",
    city: "",
    profileImage: null as File | null,
  });

  const [aboutText, setAboutText] = useState("");

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("No token found");

      const res = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user);
      setFormData({
        name: res.data.user.name || "",
        gender: res.data.user.gender || "",
        phone: res.data.user.phone || "",
        city: res.data.user.city || "",
        profileImage: null,
      });
      setAboutText(res.data.user.about || "");
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profileImage: e.target.files[0] });
    }
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("No token found");

      const data = new FormData();
      data.append("name", formData.name);
      data.append("gender", formData.gender);
      data.append("phone", formData.phone);
      data.append("city", formData.city);
      if (formData.profileImage) {
        data.append("profileImage", formData.profileImage);
      }

      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(res.data.user);
      setEditingProfile(false);
    } catch (err) {
      console.error("Profile update error:", err);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmAction(() => updateProfile);
    setShowConfirmModal(true);
  };

  const updateAbout = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) throw new Error("No token found");

      const data = new FormData();
      data.append("about", aboutText);

      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(res.data.user);
      setAboutText(res.data.user.about || "");
      setEditingAbout(false);
    } catch (err) {
      console.error("About update error:", err);
    }
  };

  const handleAboutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmAction(() => updateAbout);
    setShowConfirmModal(true);
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No profile found</p>;

  return (
    <>
      <Navbar />
      <div className="bg-[#F6F6F6] min-h-screen p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative">
            <div className="w-full h-40 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300"></div>

            {user.profileImage && (
              <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-14 w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden">
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="pt-20 pb-6 px-6 text-center">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-gray-600 text-sm">{user.email}</p>
            <p className="text-gray-500 text-sm">
              {user.phone ? `📞 ${user.phone}` : "No phone info"}
            </p>
            <p className="text-gray-500 text-sm">
              {user.city || "No city info"}
            </p>

            <div className="flex justify-center gap-4 mt-3">
              <GoPencil
                className="cursor-pointer w-5 h-5 text-gray-600 hover:text-gray-900"
                onClick={() => setEditingProfile(true)}
              />
              <EllipsisVertical className="cursor-pointer text-gray-600" />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">About</h2>
            <GoPencil
              className="cursor-pointer w-5 h-5 text-gray-600 hover:text-gray-900"
              onClick={() => setEditingAbout(true)}
            />
          </div>
          <p className="mt-4 text-gray-600">
            {user.about || "No about details available."}
          </p>
        </div>

        {/* Edit Profile Modal */}
        {editingProfile && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 ">
            <div className="bg-white rounded-lg shadow-lg p-6 w-200">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <button
                  onClick={() => setEditingProfile(false)}
                  className="text-2xl leading-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleProfileSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block font-medium">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-medium">Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProfile(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit About Modal */}
        {editingAbout && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-200 ">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-xl font-semibold">Edit About</h2>
                <button
                  onClick={() => setEditingAbout(false)}
                  className="text-2xl leading-none"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleAboutSubmit} className="mt-4 space-y-4">
                <div>
                  <textarea
                    name="about"
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    className="w-full border rounded p-2 min-h-[120px]"
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingAbout(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showConfirmModal && confirmAction && (
          <ConfirmModal
            message="Are you sure you want to save changes?"
            onConfirm={() => {
              confirmAction();
              setShowConfirmModal(false);
            }}
            onCancel={() => setShowConfirmModal(false)}
          />
        )}

        <Footer />
      </div>
    </>
  );
};

export default Profile;
