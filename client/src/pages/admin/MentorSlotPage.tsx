import { useEffect, useState } from "react";
import MentorSidebar from "../../components/Mentor/MentorSidebar";
import { getSlotsByMentor } from "../../services/slotService";

export default function MentorSlotPage() {
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false,
  });

  const limit = 10;

  // Mentor ID extraction
  const mentorDataStr = sessionStorage.getItem("mentorData");
  const mentorIdFromStorage = sessionStorage.getItem("mentorId");
  const mentor = mentorDataStr ? JSON.parse(mentorDataStr) : null;
  const mentorId = mentor?._id || mentorIdFromStorage;

  const loadSlots = async (pageNum: number = 1) => {
    if (!mentorId) return;

    try {
      setLoading(true);
      setError(null);

      const res = await getSlotsByMentor(mentorId, pageNum, limit);
      console.log("API Response:", res.data);

      setSlots(res.data.slots);
      setPagination(res.data.pagination);
      setPage(pageNum);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mentorId) {
      loadSlots(1);
    }
  }, [mentorId]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr + "T00:00:00");
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (!mentorId) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <MentorSidebar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-red-50 border border-red-300 text-red-700 px-8 py-6 rounded-lg text-center max-w-md">
            <h2 className="text-xl font-bold mb-2">Session Expired</h2>
            <p>You are not logged in as a mentor.</p>
            <button
              onClick={() => (window.location.href = "/mentor/login")}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MentorSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Your Availability Slots
        </h1>

        {loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">Loading your slots...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => loadSlots(page)} className="underline font-medium">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && slots.length === 0 && (
          <div className="bg-white rounded-lg shadow p-16 text-center">
            <p className="text-gray-600 text-lg">You haven't created any slots yet.</p>
            <p className="text-sm text-gray-500 mt-2">
              Click "Create Slots" in the sidebar to add your availability.
            </p>
          </div>
        )}

        {!loading && !error && slots.length > 0 && (
          <>
            {/* Slots Table */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Start Time</th>
                    <th className="px-6 py-4 text-left">End Time</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot: any) => (
                    <tr key={slot._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{formatDate(slot.date)}</td>
                      <td className="px-6 py-4">{slot.startTime}</td>
                      <td className="px-6 py-4">{slot.endTime}</td>
                      <td className="px-6 py-4 text-center">
                        {slot.isBooked ? (
                          <span className="inline-flex px-4 py-2 rounded-full text-xs font-bold bg-red-100 text-red-800">
                            Booked
                          </span>
                        ) : (
                          <span className="inline-flex px-4 py-2 rounded-full text-xs font-bold bg-green-100 text-green-800">
                            Available
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modern Pagination (Like Your Model) */}
            <div className="flex flex-col items-center mt-6">
              <div className="text-sm text-gray-600 mb-3">
                Showing {(page - 1) * limit + 1} to{" "}
                {Math.min(page * limit, pagination.totalItems)} of {pagination.totalItems} slots
              </div>

              <div className="flex items-center space-x-1">
                {/* Previous Button */}
                <button
                  onClick={() => loadSlots(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => loadSlots(num)}
                    className={`px-3 py-1 border border-gray-300 transition-colors ${
                      page === num
                        ? "bg-teal-600 text-white font-medium"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {num}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => loadSlots(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
}