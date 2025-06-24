import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import API from "../../services/api";
import { logout } from "../../redux/slice/authSlice";

interface UserInfo {
  name: string;
  email: string;
  profileImage: string;
}

interface Props {
  onClose: () => void;
  onLogout: () => void;
  user: UserInfo;
}

const UserDropdown = ({ onClose, onLogout }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("userToken");

      if (!token) {
        console.warn("No token found.");
        return;
      }

      await API.post(
        `/auth/logout/user`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("userToken");

      dispatch(logout());

      if (onLogout) onLogout();

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
      <div className="py-1">
        <a
          href="/profile"
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          onClick={onClose}
        >
          <User className="w-4 h-4 mr-2 text-gray-500" />
          Profile
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
        >
          <LogOut className="w-4 h-4 mr-2 text-red-600" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;
