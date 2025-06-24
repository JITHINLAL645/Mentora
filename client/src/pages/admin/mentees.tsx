import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import axios from "axios";

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
  const usersPerPage = 6;

  // Fetching users from backend
  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/mentees");
        setMentees(response.data.users); 
      } catch (error) {
        console.error("Failed to fetch mentees:", error);
      }
    };

    fetchMentees();
  }, []);

  const filteredMentees = mentees.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredMentees.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredMentees.length / usersPerPage);

  const paginate = (page: number) => setCurrentPage(page);

  const toggleStatus = async (userId: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/block/${userId}`);
      const updatedUsers = mentees.map(user =>
        user._id === userId ? { ...user, isBlock: !user.isBlock } : user
      );
      setMentees(updatedUsers);
    } catch (error) {
      console.error("Failed to toggle user status", error);
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
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm"
          />
        </div>

        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-teal-700 text-white">
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              {/* <th className="px-4 py-3 text-left">Verification</th> */}
              <th className="px-4 py-3 text-left">Block Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user._id} className="border-b border-gray-200">
                <td className="px-4 py-4">{user._id}</td>
                <td className="px-4 py-4 flex items-center gap-3">
                  {/* <img
                    src={
                      user.profileImage ||
                      "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  /> */}
                  <span>{user.name}</span>
                </td>
                <td className="px-4 py-4">{user.email}</td>
                {/* <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${user.isVerified ? "bg-green-500" : "bg-red-500"}`}></span>
                    <span>{user.isVerified ? "Verified" : "Unverified"}</span>
                  </div>
                </td> */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${user.isBlock ? "bg-red-500" : "bg-green-500"}`}></span>
                    <span>{user.isBlock ? "Blocked" : "Unblocked"}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <button
                    className={`px-4 py-1 text-white rounded-md ${
                      user.isBlock ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                    }`}
                    onClick={() => toggleStatus(user._id)}
                  >
                    {user.isBlock ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center mt-4">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
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
            ))}

            <button
              onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Mentees;
