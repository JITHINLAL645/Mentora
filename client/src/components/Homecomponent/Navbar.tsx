import { Bell, MessageSquareText } from "lucide-react";
import Mentoralogo from "../../assets/mentoraA.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import API from "../../services/api";

interface UserInfo {
  name: string;
  email: string;
  profileImage: string;
}

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserInfo>({
    name: "",
    email: "",
    profileImage: "https://via.placeholder.com/40", // fallback image
  });

  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("userToken");
    setIsAuthenticated(!!token);

    if (token) {
      try {
        const res = await API.get("/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData({
          name: res.data.name,
          email: res.data.email,
          profileImage:
            res.data.profileImage && res.data.profileImage.trim() !== ""
              ? res.data.profileImage
              : "https://via.placeholder.com/40",
        });
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();

    const handleAuthChange = () => fetchUserProfile();

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("authChange", handleAuthChange); 

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    window.dispatchEvent(new Event("authChange")); 
    setIsAuthenticated(false);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-[#F6F6F6] shadow-md p-4 flex items-center justify-between px-8">
      {/* Brand Logo */}
      <div className="flex items-center relative w-10 h-10">
        <img
          src={Mentoralogo}
          alt="Mentora Logo"
          className="absolute top-1 left-21 scale-[6.2] object-contain"
        />
      </div>

      <div className="hidden ml-20 md:flex gap-10 text-sm font-medium text-gray-500 ">
        <a href="/" className="hover:text-orange-600">Home</a>
        {/* <a href="#" className="hover:text-orange-600">Dashboard</a> */}
        <a href="/mentorPage" className="hover:text-orange-600">Mentors</a>
        <a href="" className="hover:text-orange-600">Sessions</a>
        <a href="/about" className="hover:text-orange-600">About</a>
        <a href="/mentorDashboard" className="hover:text-orange-600">mentor</a>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Bell className="w-6 h-6 text-gray-700 hover:text-orange-600 cursor-pointer mr-5" />
            <MessageSquareText className="w-6 h-6 text-gray-700 hover:text-orange-600 cursor-pointer mr-5" />
            <div className="relative">
              <img
                src={userData.profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-orange-600 cursor-pointer"
                onClick={toggleDropdown}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d3XqDIAxAlfivoO//tEOZWzvbVTEpic252W3PF0gAIcsyRVEURVEURVEURVEURVEURVEURVEURVEURVEURflgAFL/AirAqzXO9R7XNBVcy9TbuMHmxjN6lr92cNVVLKEurVfK/zCORVvW8iUBnC02dj+Wpu0z0Y6QlaN5phcwZqjkOkK5HZyPAjkIjSO4fIdfcOwFKkJlX4zPu7Ha1tIcwR3wWxyFhRG6g4Je0YpSPDJCV8a2Sv2zd1O1x/2WMDZCwljH+clRrHfWCLGK8REMiql//2si5+DKWKcWeAGcFMzzNrXC/0TUwQ2s6+LhlcwjTMlYsUIQzPOCb7YBiyHopyLXIEKPEkI/TgeuiidK/R9FniUDOjRDpvm0RhqjMyyXNjDhCfIMYl1gGjIMIuYsnGEYRMRZOMMunaLVwpWRW008v6fYKDIzxCwVAeNSO90BJW6emelYBRF/kHpYGVaoxTDAaxOFsfP9y8hpJ4xd7gOcij7JNGQ1EYFgkPJa1jQEiYZXRaRINKxSDUW9n+FT82lSKadkiru9/4XPqSLWOekGPoY05TAvLm9orm+YWuwHoBHkZKijNBJGmeb61eL6Ff/6q7bLr7yvv3vKGhpDRjvgjGaPz+gUg6YgcvpyAR2FIZ9U6nEEyZRTovmEU32KichpGn7C17XrfyH9gK/c0CMP05HZIM2uf9sEveizKveBy9/6Qt7o89ne33D525cfcIMW6ab+TMEukQbQbu+xu7X3A9bChmWaCeAkG17bpntwXgWxHaMzGPmUaR5dQZiKqRVeUZ3047fi3nAu28h4CHxCsZAgmEH8Y27jJAhm8c+5RQzRQNVGhVFSfxOYIjp/pP7RxzjevYXVGf4eLt+BJ1vCuLuLkrgABgCGXZ2wik5uty+oBvNirI6mkzhAf4Gsb58Hcm67Jzd+KwD10BYPLL3e0MjvKrgAULnOfveF/O4N2Xb9BZom3gJes3F9X5Zze8/6Yt09b4CrqsEjUv8oFBaR2rl+6CZr2xVrp24o/WitBKuGrrpl1+bFkmK2qXTON4VpbdfLa7o7y/WdLxG7lm2Lqh2clOwTegbvc/vj2U78CwhA87Bn8G5Nk3eOb0Nsr9flz3sG78UUtue4kpv1xvjg3TMay62BMlTlP+vrOMnJsRmt/ze0jsfkPPYdAH57hK+34PeOyc8XIXu5xT2HsUkdZz+adwg8HGFfQ3K5jtDvbUiO4Di9/ywHGrL88pDizZ++oTp+an+SMX/ndymUCwmHMdO7yuOx83pUx/eEMU0AvxWndwgidAqOZ8ypCwdEfvvEo6D9HwpA8wzvmOJEqAg9ySu8g4x0Hb9hSB/BANEKJ+LbPBU0lzbAJs4xt1AoshKkUGQmiH8/jJ0gdhTTLmSegHlPE0oOdXALnqDjKYh3px//fSgSWG8UqfrrIICzYYSJXRr9BSPbpNzw7gBjKjKOYI7ReIGqQRIap5+5MdjyvuDkExvGeXSlONWZAP3/AZBwJohU7QJRGU+cTVH18ELmRPNBmibW6MT/k1b0XhdkRBvyT6SB6EYv/GvhSmRNpGngRULsAlxMCGNXp7w3FfdEbTEEDdLI9TdIKRUzUesa3I461ER8cpNT7gMRhpKmYVS9ELOgCUQsa4SsulciKiLbY+AnHD8cpuhISsnxpamI84sbDq9qYJgf8wiiOBrC7Ml7M7ZECCqKoiiKoiiKoiiKoijv5AvJxlZRyNWWLwAAAABJRU5ErkJggg";
                }}
              />
              {isDropdownOpen && (
                <UserDropdown
                  onClose={() => setIsDropdownOpen(false)}
                  onLogout={handleLogout}
                  user={userData}
                />
              )}
            </div>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-900 text-white rounded-2xl hover:bg-blue-600 w-30 transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
