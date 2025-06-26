import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import {
  getAllMentors,
  toggleMentorApproval,
} from "../../services/mentorService";

export interface IMentor {
  _id: string;
  profileImg: string;
  fullName: string;
  email: string;
  specialization: string;
  education: string;
  experience: number;
  street: string;
  city: string;
  state: string;
  pincode: string;
  about?: string;
  isApproved: boolean;
  phone: string;
  availableDays: string[];
}

export default function MentorListPage() {
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const mentorsPerPage = 5;

  const fetchMentors = async () => {
    try {
      const response = await getAllMentors();
      const mentorData = response.data.data || [];
      setMentors(mentorData);
      if (!mentorData.length) {
        toast.info("No mentors found");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch mentors");
      setMentors([]);
    }
  };

  const handleApprovalToggle = async (id: string) => {
    try {
      await toggleMentorApproval(id);
      toast.success("Approval status updated");
      await fetchMentors();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error updating approval status"
      );
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter((mentor) =>
    mentor.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMentors.length / mentorsPerPage);
  const indexOfLastMentor = currentPage * mentorsPerPage;
  const indexOfFirstMentor = indexOfLastMentor - mentorsPerPage;
  const currentMentors = filteredMentors.slice(
    indexOfFirstMentor,
    indexOfLastMentor
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <div className="p-4">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border rounded-lg shadow-sm"
          />
        </div>

        {currentMentors.length === 0 ? (
          <p className="text-gray-500 px-4">No mentors found.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-teal-700 text-white">
                <th className="px-4 py-3 text-left">Mentor</th>
                <th className="px-4 py-3 text-left">Specialization</th>
                <th className="px-4 py-3 text-left">Education</th>
                <th className="px-4 py-3 text-left">Experience</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentMentors.map((mentor) => (
                <tr key={mentor._id} className="border-b border-gray-200">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={mentor.profileImg}
                        alt={mentor.fullName}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                      <div>
                        <p className="font-medium">{mentor.fullName}</p>
                        <p className="text-sm text-gray-500">{mentor.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">{mentor.specialization}</td>
                  <td className="px-4 py-4">{mentor.education}</td>
                  <td className="px-4 py-4">{mentor.experience} yrs</td>
                  <td className="px-4 py-4">
                    {mentor.street}, {mentor.city}, {mentor.state} -{" "}
                    {mentor.pincode}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          mentor.isApproved ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></span>
                      <span>{mentor.isApproved ? "Approved" : "Pending"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      className={`px-4 py-1 text-white rounded-md ${
                        mentor.isApproved
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                      onClick={() => handleApprovalToggle(mentor._id)}
                    >
                      {mentor.isApproved ? "Unapprove" : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages >= 1 && (
          <div className="flex justify-center mt-4">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 border-t border-b border-gray-300 ${
                      currentPage === number
                        ? "bg-teal-600 text-white"
                        : "bg-white text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  paginate(
                    currentPage < totalPages ? currentPage + 1 : totalPages
                  )
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
