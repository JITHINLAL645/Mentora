import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import CommonTable from "../../components/Admin/CommonTable";
import MentorDetailsModal from "../../components/Admin/MentorDetailsModal";

import {
  getAllMentors,
  toggleMentorApproval,
  rejectMentor,
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
  rejectionReason?: string;
  phone: string;
  availableDays: string[];
  gender: string;
  rating: number;
  reviewCount: number;
  kycCertificate: string;
}

export default function MentorListPage() {
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<IMentor | null>(null);

  const mentorsPerPage = 5;

  const fetchMentors = async (page: number) => {
    try {
      setLoading(true);
      const response = await getAllMentors(page, mentorsPerPage);
      const responseData = response.data.data || response.data;

      const { mentors, totalPages, currentPage: responsePage } = responseData;
      setMentors(mentors || []);
      setTotalPages(totalPages || 1);
      setCurrentPage(responsePage || page);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch mentors");
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors(currentPage);
  }, [currentPage]);

  const filteredMentors = mentors.filter((mentor) =>
    mentor.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleApprovalToggle = async (id: string) => {
    try {
      await toggleMentorApproval(id);
      toast.success("Approval status updated");
      fetchMentors(currentPage);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating approval");
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await rejectMentor(id, reason);
      toast.success("Mentor rejected successfully");
      fetchMentors(currentPage);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject mentor");
    }
  };

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
              if (currentPage !== 1) setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading mentors...</p>
          </div>
        ) : (
          <CommonTable
            columns={[
              {
                header: "Mentor",
                key: "fullName",
                render: (mentor) => (
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => setSelectedMentor(mentor)}
                  >
                    <img
                      src={
                        mentor.profileImg ||
                        "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
                      }
                      alt={mentor.fullName}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div>
                      <p className="font-medium hover:underline">{mentor.fullName}</p>
                      <p className="text-sm text-gray-500">{mentor.email}</p>
                    </div>
                  </div>
                ),
              },
              { header: "Specialization", key: "specialization" },
              { header: "Education", key: "education" },
              {
                header: "Experience",
                key: "experience",
                render: (mentor) => `${mentor.experience} yrs`,
              },
              {
                header: "Location",
                key: "location",
                render: (mentor) =>
                  `${mentor.city}, ${mentor.state} - ${mentor.pincode}`,
              },
              {
                header: "Status",
                key: "isApproved",
                render: (mentor) => (
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        mentor.isApproved ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    <span>
                      {mentor.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                ),
              },
              {
                header: "Rejection Reason",
                key: "rejectionReason",
                render: (mentor) => mentor.rejectionReason || "-",
              },
              {
                header: "Action",
                key: "action",
                render: (mentor) => (
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-1 text-white rounded-md transition-colors ${
                        mentor.isApproved
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                      onClick={() => handleApprovalToggle(mentor._id)}
                    >
                      {mentor.isApproved ? "Unapprove" : "Approve"}
                    </button>
                    {!mentor.isApproved && (
                      <button
                        className="px-4 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        onClick={() => handleReject(mentor._id)}
                      >
                        Reject
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
            data={filteredMentors}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
          />
        )}

        {/* MODAL */}
        {selectedMentor && (
          <MentorDetailsModal
            mentor={selectedMentor}
            onClose={() => setSelectedMentor(null)}
          />
        )}
      </div>
    </div>
  );
}
