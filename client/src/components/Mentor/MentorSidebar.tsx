import React from "react";
import { useNavigate } from "react-router-dom";
import Mentoralogo from "../../assets/mentoraA.png";
import {
  LayoutDashboard,
  CalendarClock,
  UserCircle,
  MessageCircle,
  Video,
  LogOut,
} from "lucide-react";

const MentorSidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("mentorToken");
    navigate("/login");
  };

  const menuItems = [
    { name: "Dashboard", path: "/mentorDashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Appointment", path: "", icon: <CalendarClock size={18} /> },
    { name: "Profile", path: "/mentorProfile", icon: <UserCircle size={18} /> },
    { name: "Chat", path: "", icon: <MessageCircle size={18} /> },
    { name: "Video Call", path: "", icon: <Video size={18} /> },
  ];

  return (
    <div className="w-64 h-screen bg-[#1f2937] text-white flex flex-col items-center py-6 shadow-md">
      <div className="mb-8">
        <div className="relative w-10 h-10">
          <img
            src={Mentoralogo}
            alt="Mentora Logo"
            className="absolute top-0 left- scale-[6.2] object-contain"
          />
        </div>
      </div>

      <ul className="flex flex-col gap-4 w-full px-4">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className="flex items-center gap-3 py-2 px-4 rounded-md hover:bg-[#374151] cursor-pointer transition-all"
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            {item.name}
          </li>
        ))}

        <li
          className="flex items-center gap-3 py-2 px-4 rounded-md hover:bg-red-500 hover:text-white cursor-pointer font-semibold transition-all"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </li>
      </ul>
    </div>
  );
};

export default MentorSidebar;
