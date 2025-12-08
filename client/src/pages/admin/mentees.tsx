import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import axios from "axios";
import CommonTable from "../../components/Admin/CommonTable";

interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  isVerified?: boolean;
  isBlock?: boolean;
}

const Mentees: React.FC = () => {
  const [mentees, setMentees] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const usersPerPage = 6;

  // Get auth token 
  const getAuthToken = () => {
  const rawToken =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("token");

  if (!rawToken) return null;

  try {
    const parsed = JSON.parse(rawToken);
    return typeof parsed === "string" ? parsed : rawToken;
  } catch {
    return rawToken;
  }
};



  // Configure axios headers
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  };

  // Fetch mentees (with pagination + search)
  useEffect(() => {
    const fetchMentees = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/admin/mentees`,
          {
            params: {
              page: currentPage,
              limit: usersPerPage,
              search: search || undefined,
            },
            ...axiosConfig,
          }
        );

        const { data, totalPages, currentPage: current } = response.data;

        setMentees(data || []);
        setTotalPages(totalPages || 1);
        setCurrentPage(current || 1);
      } catch (error: any) {
        console.error("Failed to fetch mentees:", error);

        if (error.response?.status === 401) {
          console.error("Unauthorized - Please login again");
          // Optional: redirect to login
          // window.location.href = "/admin/login";
        }

        setMentees([]);
      } finally {
        setLoading(false);
      }
    };

    // debounce search
    const timeoutId = setTimeout(() => {
      fetchMentees();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, search]);

  // Pagination handler (backend-based)
  const paginate = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Toggle block/unblock user
  const toggleStatus = async (userId: string) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/block/${userId}`,
        {},
        axiosConfig
      );

      // Update the mentee state locally
      const updatedUsers = mentees.map((user) =>
        user._id === userId ? { ...user, isBlock: !user.isBlock } : user
      );
      setMentees(updatedUsers);
    } catch (error: any) {
      console.error("Failed to toggle user status", error);
      if (error.response?.status === 401) {
        console.error("Unauthorized - Please login again");
      }
    }
  };

  return (
    <div className="flex h-screen">
      <AdminSidebar />
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {/* Search Bar */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border rounded-lg shadow-sm"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-4 text-gray-600">Loading...</div>
        )}

        {/* Table */}
        {!loading && (
          <CommonTable
            columns={[
              { header: "Name", key: "name" },
              { header: "Email", key: "email" },
              {
                header: "Block Status",
                key: "isBlock",
                render: (user) => (
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        user.isBlock ? "bg-red-500" : "bg-green-500"
                      }`}
                    ></span>
                    <span>{user.isBlock ? "Blocked" : "Unblocked"}</span>
                  </div>
                ),
              },
              {
                header: "Action",
                key: "action",
                render: (user) => (
                  <button
                    className={`px-4 py-1 text-white rounded-md ${
                      user.isBlock
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                    onClick={() => toggleStatus(user._id)}
                  >
                    {user.isBlock ? "Unblock" : "Block"}
                  </button>
                ),
              },
            ]}
            data={mentees}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
          />
        )}
      </div>
    </div>
  );
};

export default Mentees;
