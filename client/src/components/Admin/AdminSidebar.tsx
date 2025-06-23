import React from "react";
import { useNavigate } from "react-router-dom";
import Mentoralogo from "../../assets/mentoraA.png";

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen bg-[#1f2937] text-white flex flex-col items-center py-6 shadow-md">
      {/* Logo */}
      <div className="mb-8">
        <div className="relative w-10 h-10">
          <img
            src={Mentoralogo}
            alt="Mentora Logo"
            className="absolute top-0 left- scale-[6.2] object-contain"
          />
        </div>
      </div>

      {/* Navigation Items */}
      <ul className="flex flex-col gap-4 w-full px-4">
        {[
          { name: "Dashboard", path: "/admin/dashboard" },
          { name: "Mentees", path: "/admin/mentees" },
          { name: "Mentors", path: "/admin/mentors" },
          { name: "Mentor Registration", path: "/admin/mentor-registration" },
        ].map((item) => (
          <li
            key={item.name}
            className="py-2 px-4 rounded-md hover:bg-[#374151] cursor-pointer transition-all"
            onClick={() => navigate(item.path)}
          >
            {item.name}
          </li>
        ))}

        <li
          className="py-2 px-4 rounded-md hover:bg-red-500 hover:text-white cursor-pointer font-semibold transition-all"
          onClick={handleLogout}
        >
          Logout
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
