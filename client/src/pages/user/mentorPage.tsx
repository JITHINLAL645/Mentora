import React, { useEffect, useState } from "react";
import { FaStar, FaHeart } from "react-icons/fa";
import { Info, Search } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Homecomponent/Navbar";
import Footer from "../../components/Homecomponent/Footer";
import { getApprovedMentors } from "../../api/user/mentor";

interface IMentor {
  _id: string;
  fullName: string;
  email: string;
  profileImg: string;
  specialization: string;
  education: string;
  experience: number;
  city: string;
  street: string;
  state: string;
  gender: string;
  about?: string;
  phone?: string;
}

const MentorPage: React.FC = () => {
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 4;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await getApprovedMentors();
        setMentors(response.data.data || []);
      } catch (error) {
        toast.error("Failed to load mentors.");
      }
    };
    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter((mentor) =>
    mentor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (specializationFilter ? mentor.specialization === specializationFilter : true) &&
    (genderFilter ? mentor.gender === genderFilter : true) &&
    mentor.experience >= experienceFilter
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredMentors.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentMentors = filteredMentors.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (page: number) => setCurrentPage(page);

  return (
    <div >
      <Navbar />

      <div className="p-4 md:p-8 min-h-screen bg-[#F6F6F6]">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-teal-700">OUR MENTORS</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          {/* Filters */}
          <div className="space-y-4">
            <button
              onClick={() => {
                setSearchQuery("");
                setSpecializationFilter("");
                setGenderFilter("");
                setExperienceFilter(1);
              }}
              className="w-full px-4 py-2 bg-teal-200 rounded hover:bg-teal-600"
            >
              Clear Filters
            </button>

            <div>
              <h2 className="font-semibold mb-1">Specialization</h2>
              {["General coach", "clinical", "counseling", "neuropsychology"].map((specialty) => (
                <button
                  key={specialty}
                  className={`block w-full px-4 py-2 rounded-md border ${
                    specializationFilter === specialty ? "bg-teal-500 text-white" : "bg-white"
                  }`}
                  onClick={() => setSpecializationFilter(specialty)}
                >
                  {specialty}
                </button>
              ))}
            </div>

            <div>
              <h2 className="font-semibold mb-1">Gender</h2>
              {["Male", "Female", "Other"].map((g) => (
                <label key={g} className="block">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    onChange={(e) => setGenderFilter(e.target.value)}
                  />
                  <span className="ml-2">{g}</span>
                </label>
              ))}
            </div>

            <div>
              <h2 className="font-semibold mb-1">Experience</h2>
              <input
                type="range"
                min="1"
                max="20"
                value={experienceFilter}
                onChange={(e) => setExperienceFilter(Number(e.target.value))}
              />
              <p className="text-sm text-gray-500 mt-1">{experienceFilter}+ years</p>
            </div>
          </div>

          {/* Mentor List */}
          <div className="md:col-span-3 space-y-6">
            <div className="relative mb-4 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search mentors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border rounded shadow-md"
              />
              <Search className="absolute right-3 top-3 text-gray-400" />
            </div>

            {currentMentors.length === 0 ? (
              <p className="text-center text-gray-500">No mentors found.</p>
            ) : (
              currentMentors.map((mentor) => (
                <div
                  key={mentor._id}
                  className="flex flex-col md:flex-row items-center gap-6 p-4 md:p-6 border rounded-lg shadow-md"
                >
                  <img
                    src={mentor.profileImg || "/default-profile.png"}
                    alt={mentor.fullName}
                    className="w-24 h-24 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-semibold">{mentor.fullName}</h3>
                    <p className="text-sm text-gray-500">{mentor.specialization}</p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-1 bg-gray-200 text-xs rounded">
                        {mentor.experience} yrs
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-500 text-xs font-semibold rounded">
                        <FaHeart />
                        LOYAL MENTEES
                        <Info className="w-4 h-4" />
                      </span>
                    </div>

                    <div className="flex gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-sm" />
                      ))}
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                      {mentor.street}, {mentor.city}, {mentor.state}
                    </p>
                  </div>

                  <div className="mt-4 md:mt-0">
                    <button
                      className="px-4 py-2 bg-teal-600 text-white rounded shadow"
                      onClick={() => navigate(`/mentors/${mentor._id}`)}
                    >
                      Show Availability
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => paginate(currentPage - 1)}
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
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      <Footer />
      </div>

    </div>
  );
};

export default MentorPage;
