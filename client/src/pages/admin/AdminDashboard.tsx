import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import axios from "axios";

const AdminDashboard: React.FC = () => {
  const [totalMentees, setTotalMentees] = useState(0);
  const [blockedMentees, setBlockedMentees] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/users/count");
        setTotalMentees(response.data.totalMentees);
        setBlockedMentees(response.data.blockedMentees);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex h-screen">
      <AdminSidebar />

      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              Total Mentees
            </h2>
            <p className="text-3xl font-bold text-teal-600 mt-2">{totalMentees}</p>
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              Blocked Mentees
            </h2>
            <p className="text-3xl font-bold text-red-500 mt-2">{blockedMentees}</p>
          </div>

          {/* Dummy box */}
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700">
              Active Sessions
            </h2>
            <p className="text-3xl font-bold text-blue-500 mt-2">23</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
