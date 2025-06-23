import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Pencil } from "lucide-react";
import Navbar from "../../components/Homecomponent/Navbar";
import Footer from "../../components/Homecomponent/Footer";

interface ProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  position: string;
  location: string;
  about: string;
  profileImage: string;
}

const Profile: React.FC = () => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditAboutOpen, setIsEditAboutOpen] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    position: "",
    location: "",
    about: "",
    profileImage: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("Fetched Profile:", res.data); // 👈 Add this

        setProfileData(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    })();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Mentora");
      const cloudName = "dha3cpw1u";

      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      const imageUrl = data.secure_url;
      setProfileData((prev) => ({ ...prev, profileImage: imageUrl }));
      console.log(imageUrl, "oooooooooooooo");

      await axios.patch(
        "/api/auth/profile",
        { profileImage: imageUrl },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  const handleSaveProfile = async () => {
    console.log("Save Profile clicked");
    try {
      const res = await axios.patch(
        "/api/user/profile",
        {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phoneNumber: profileData.phoneNumber,
          position: profileData.position,
          location: profileData.location,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Profile updated:", res.data);

      const refreshedData = await axios.get("/api/user/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setProfileData(refreshedData.data);
      setIsEditProfileOpen(false);
    } catch (err: any) {
      console.error("Error saving profile:", err.response?.data || err.message);
    }
  };

  const handleSaveAbout = async () => {
    try {
      await axios.patch(
        "/api/user/profile",
        { about: profileData.about },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const res = await axios.get("/api/user/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProfileData(res.data);

      setIsEditAboutOpen(false);
    } catch (err) {
      console.error("Failed to save about info:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#F6F6F6] min-h-screen p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative">
            <div className="h-40 bg-gradient-to-b from-blue-100 to-white" />
            <div className="absolute top-20 left-6">
              <div
                className="w-28 h-28 bg-gray-200 rounded-full overflow-hidden border-4 border-white shadow-md cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                title="Click to change profile image"
              >
                {profileData.profileImage ? (
                  <img
                    src={profileData.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Upload
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
            <div className="pt-20 pb-6 px-6 flex justify-between items-start">
              <div>
                <p className="text-gray-700 font-semibold">
                  {profileData.firstName} {profileData.lastName}
                </p>
                <p className="text-gray-600 text-sm">{profileData.position}</p>
                <p className="text-gray-500 text-sm">{profileData.location}</p>
              </div>
              <Pencil
                className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900"
                onClick={() => setIsEditProfileOpen(true)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">About</h2>
            <Pencil
              className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900"
              onClick={() => setIsEditAboutOpen(true)}
            />
          </div>
          <p className="mt-4 text-gray-600">{profileData.about}</p>
        </div>

        {isEditProfileOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-310 h-110">
              <div className="flex  justify-between items-center text-2xl  border-b pb-4">
                <h2>Personal Information</h2>
                <button
                  onClick={() => setIsEditProfileOpen(false)}
                  className="text-2xl"
                >
                  &times;
                </button>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  "firstName",
                  "lastName",
                  "phoneNumber",
                  "position",
                  "location",
                ].map((field) => (
                  <div key={field}>
                    <label className="capitalize block">{field}</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      value={(profileData as any)[field]}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleSaveProfile}
                className="mt-6 w-full bg-blue-900 hover:bg-blue-700 text-white p-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {isEditAboutOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
              <div className="flex justify-between items-center text-xl border-b pb-4">
                <h2>Edit About</h2>
                <button
                  onClick={() => setIsEditAboutOpen(false)}
                  className="text-2xl"
                >
                  &times;
                </button>
              </div>
              <textarea
                className="w-full border border-orange-400 rounded-md p-4 h-48 mt-4"
                value={profileData.about}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, about: e.target.value }))
                }
              />
              <button
                onClick={handleSaveAbout}
                className="mt-4 bg-blue-900 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Profile;
