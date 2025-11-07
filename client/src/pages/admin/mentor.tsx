import { useEffect, useState } from "react";
import { toast } from "sonner";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import CommonTable from "../../components/Admin/CommonTable";
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
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const mentorsPerPage = 5;

  // ✅ Fetch mentors with pagination
  const fetchMentors = async (page: number) => {
    try {
      setLoading(true);
      console.log("🔵 FETCHING MENTORS FOR PAGE:", page);
      
      const response = await getAllMentors(page, mentorsPerPage);
      console.log("🟢 API Response received:", response.data);

      // ✅ Fixed: Check both possible response structures
      const responseData = response.data.data || response.data;
      
      const { mentors, totalPages, currentPage: responsePage } = responseData;
      
      console.log("📊 Setting state with:");
      console.log("  - Mentors count:", mentors?.length);
      console.log("  - Total Pages:", totalPages);
      console.log("  - Current Page:", responsePage);

      setMentors(mentors || []);
      setTotalPages(totalPages || 1);
      setCurrentPage(responsePage || page);
      
      console.log("✅ State updated successfully");
    } catch (error: any) {
      console.error("❌ Fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch mentors");
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered with currentPage:", currentPage);
    fetchMentors(currentPage);
  }, [currentPage]);

  const filteredMentors = Array.isArray(mentors)
    ? mentors.filter((mentor) =>
        mentor.fullName?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // ✅ Pagination Handler - Fixed to properly update state
  const paginate = (pageNumber: number) => {
    console.log("Paginating to page:", pageNumber);
    console.log("Current page before update:", currentPage);
    console.log("Total pages:", totalPages);
    
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      console.log("Setting current page to:", pageNumber);
      setCurrentPage(pageNumber);
    } else {
      console.log("Page number out of bounds");
    }
  };

  // ✅ Approve / Unapprove
  const handleApprovalToggle = async (id: string) => {
    try {
      await toggleMentorApproval(id);
      toast.success("Approval status updated");
      fetchMentors(currentPage);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error updating approval status"
      );
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {/* 🔍 Search Input */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              // Reset to page 1 when searching
              if (currentPage !== 1) {
                setCurrentPage(1);
              }
            }}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading mentors...</p>
          </div>
        )}

        {/* 🧾 Mentor Table */}
        {!loading && (
          <CommonTable
            columns={[
              {
                header: "Mentor",
                key: "fullName",
                render: (mentor) => (
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        mentor.profileImg ||
                        "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
                      }
                      alt={mentor.fullName}
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <div>
                      <p className="font-medium">{mentor.fullName}</p>
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
                    <span>{mentor.isApproved ? "Approved" : "Pending"}</span>
                  </div>
                ),
              },
              {
                header: "Action",
                key: "action",
                render: (mentor) => (
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
                ),
              },
            ]}
            data={filteredMentors}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
          />
        )}
      </div>
    </div>
  );
}