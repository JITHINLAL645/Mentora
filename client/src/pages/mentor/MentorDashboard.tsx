import React from "react";
import MentorSidebar from "../../components/Mentor/MentorSidebar";

const MentorDashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <MentorSidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">Welcome Mentor 👋</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Total Appointments</h2>
            <p className="text-3xl font-bold text-teal-600">12</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Upcoming Sessions</h2>
            <p className="text-3xl font-bold text-teal-600">3</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Messages</h2>
            <p className="text-3xl font-bold text-teal-600">5</p>
          </div>
        </div>        
      </div>
    </div>
  );
};

export default MentorDashboard;
