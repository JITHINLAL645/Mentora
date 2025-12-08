import React, { useEffect, useState } from "react";
import MentorSidebar from "../../components/Mentor/MentorSidebar";
import { toast } from "sonner";
import { FaVideo, FaCalendarAlt, FaClock } from "react-icons/fa";

interface IUser {
  name: string;
  profileImage?: string;
}

interface IAppointment {
  _id: string;
  user: IUser;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

const AllMentorAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  const fetchAppointments = async () => {
    try {
      const token = sessionStorage.getItem("mentorToken");

      if (!token) {
        toast.error("Mentor not authenticated");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/mentors/bookings/my-appointments?page=${currentPage}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to load appointments");
        return;
      }

      setAppointments(data.appointments || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentPage]);

  const paginate = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <p className="p-8 text-center text-gray-700">
        Loading appointments...
      </p>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64">
        <MentorSidebar />
      </div>

      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6">Your Appointments</h2>

        {appointments.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">
            No appointments found.
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {appointments.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white shadow rounded-lg p-5 flex items-center justify-between hover:shadow-md transition"
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        booking.user.profileImage ||
                        "/default-profile.png"
                      }
                      alt={booking.user.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />

                    <div>
                      <h3 className="text-xl font-semibold">
                        {booking.user.name}
                      </h3>

                      <p className="text-gray-600 capitalize">
                        Status: {booking.status}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-gray-700">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt />
                          {new Date(booking.date).toLocaleDateString()}
                        </span>

                        <span className="flex items-center gap-1">
                          <FaClock />
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <button
                    className="flex items-center gap-2 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition"
                    onClick={() => toast.success("Session Started")}
                  >
                    <FaVideo className="text-xl" /> Start Session
                  </button>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-1">

                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      onClick={() => paginate(num)}
                      className={`px-3 py-1 border border-gray-300 ${
                        currentPage === num
                          ? "bg-teal-600 text-white"
                          : "bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {num}
                    </button>
                  )
                )}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>

              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllMentorAppointments;
