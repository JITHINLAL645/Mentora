import { Bell, MessageSquareText } from "lucide-react";
import Mentoralogo from "../../assets/mentoraA.png";
import default_img from "../../assets/default-img.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDropdown from "./UserDropdown";
import API from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";
import { logout, setUser } from "../../redux/slice/authSlice";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);
  const isAuthenticated = auth.isAuthenticated;
  const user = auth.user;

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    try {
      const res = await API.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      const userData = res.data.user;
      console.log("User data from API:", userData);

      dispatch(
        setUser({
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          profileImage:
            userData.profileImage && userData.profileImage.startsWith("http")
              ? userData.profileImage
              : default_img,
          isAdmin: userData.isAdmin || false,
          token,
        })
      );
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  useEffect(() => {
    // ✅ Check for token in URL (Google OAuth redirect)
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("userToken", token);

      // clean URL (remove ?token=xxx)
      window.history.replaceState({}, document.title, "/");

      fetchUserProfile();
    } else {
      fetchUserProfile();
    }

    const handleAuthChange = () => fetchUserProfile();
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await API.get("/auth/logout", { withCredentials: true });
    } catch (err) {
      console.error("Logout failed", err);
    }

    dispatch(logout());
    window.dispatchEvent(new Event("authChange"));
  };

  return (
    <nav className="bg-[#F6F6F6] shadow-md p-4 flex items-center justify-between px-8">
      {/* Logo */}
      <div className="flex items-center relative w-10 h-10">
        <img
          src={Mentoralogo}
          alt="Mentora Logo"
          className="absolute top-1 left-21 scale-[6.2] object-contain"
        />
      </div>

      {/* Center Links */}
      <div className="hidden ml-20 md:flex gap-10 text-sm font-medium text-gray-500">
        <a href="/" className="hover:text-teal-600">
          Home
        </a>
        <a href="/mentorPage" className="hover:text-teal-600">
          Mentors
        </a>
        <a href="#" className="hover:text-teal-600">
          Sessions
        </a>
        <a href="/about" className="hover:text-teal-600">
          About
        </a>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <>
            <Bell className="w-6 h-6 text-gray-700 hover:text-orange-600 cursor-pointer mr-5" />
            <MessageSquareText className="w-6 h-6 text-gray-700 hover:text-orange-600 cursor-pointer mr-5" />
            <div className="relative">
              <img
                src={user.profileImage || default_img}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-orange-600 cursor-pointer object-cover"
                onClick={toggleDropdown}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = default_img;
                }}
              />

              {isDropdownOpen && (
                <UserDropdown
                  onClose={() => setIsDropdownOpen(false)}
                  onLogout={handleLogout}
                  user={{
                    name: user.name,
                    email: user.email,
                    profileImage: user.profileImage || default_img,
                  }}
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
