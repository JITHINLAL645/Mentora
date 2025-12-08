import React, { useEffect, useState } from "react";
import Navbar from "../../components/Homecomponent/Navbar";
import Footer from "../../components/Homecomponent/Footer";
import { toast } from "sonner";
import { FaVideo, FaCalendarAlt, FaClock } from "react-icons/fa";
import ConfirmCancelModal from "../../components/user/ConfirmCancelModal";

interface IBooking {
  _id: string;
  mentor: {
    fullName: string;
    profileImg: string;
    specialization: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  amount: number;
  paymentStatus: string;
  status: string;
}

const AllBookedSessions: React.FC = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const [selectedSessionName, setSelectedSessionName] = useState<string>("");

  const totalPages = Math.ceil(total / limit);

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) return toast.error("Not authenticated");

      const url = `${
        import.meta.env.VITE_API_BASE_URL
      }/auth/my-sessions?page=${currentPage}&limit=${limit}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (!res.ok)
        return toast.error(data.message || "Failed to load sessions");

      setBookings(data.sessions || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage]);

  // Open modal
  const handleCancelClick = (id: string, name: string) => {
    setSelectedSessionId(id);
    setSelectedSessionName(name);
    setModalOpen(true);
  };

  // Confirm cancel session
  const confirmCancelSession = async () => {
    if (!selectedSessionId) return;

    try {
      const token = localStorage.getItem("userToken");
      if (!token) return toast.error("Not authenticated");

      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/mentors/cancel-session/${selectedSessionId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();

      if (!res.ok)
        return toast.error(data.message || "Failed to cancel session");

      toast.success("Session cancelled successfully");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedSessionId ? { ...b, status: "Cancelled" } : b
        )
      );

      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  // Pagination
  const paginate = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  if (loading)
    return <p className="p-8 text-center">Loading your sessions...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Your Booked Sessions</h2>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-600">No booked sessions found.</p>
        ) : (
          <>
            <div className="space-y-4">
              {bookings.map((session) => (
                <div
                  key={session._id}
                  className="bg-white shadow rounded-lg p-5 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={session.mentor.profileImg || "/default-profile.png"}
                      alt={session.mentor.fullName}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">
                        {session.mentor.fullName}
                      </h3>
                      <p className="text-gray-600">
                        {session.mentor.specialization}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-gray-700">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt />
                          {new Date(session.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock /> {session.startTime} - {session.endTime}
                        </span>
                      </div>
                      <div className="mt-3 text-sm text-gray-700 space-y-1">
                        <p>
                          <strong>Amount Paid:</strong> ₹{session.amount}
                        </p>
                        <p>
                          <strong>Payment Status:</strong>{" "}
                          <span className="text-green-600 font-medium">
                            {session.paymentStatus}
                          </span>
                        </p>
                        <p>
                          <strong>Booking Status:</strong>{" "}
                          <span
                            className={`${
                              session.status === "Cancelled"
                                ? "text-red-600"
                                : "text-blue-600"
                            } font-medium`}
                          >
                            {session.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 gap-3">
                    {session.status !== "Cancelled" && (
                      <>
                        <button
                          className="flex items-center gap-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                          onClick={() =>
                            handleCancelClick(
                              session._id,
                              session.mentor.fullName
                            )
                          }
                        >
                          Cancel Session
                        </button>
                        <button
                          className="flex items-center gap-2 bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition"
                          onClick={() => toast.success("Session starting...")}
                        >
                          <FaVideo className="text-xl" /> Start Session
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
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

      <Footer />

      {/* Confirm Cancel Modal */}
      <ConfirmCancelModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmCancelSession}
        sessionName={selectedSessionName}
      />
    </div>
  );
};

export default AllBookedSessions;
