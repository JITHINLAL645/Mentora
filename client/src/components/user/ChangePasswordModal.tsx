import React, { useState } from "react";
import { changePasswordApi } from "../../api/user/changePasswordApi";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  onClose: () => void;
}

const ChangePasswordModal: React.FC<Props> = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  
  const validate = () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill all fields");
      return false;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return false;
    }

    if (newPassword === currentPassword) {
      toast.error("New password cannot be same as current password");
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      if (!validate()) return;

      await changePasswordApi(currentPassword, newPassword);
      toast.success("Password updated successfully");

      localStorage.removeItem("userToken");
      onClose();
      window.location.href = "/login";
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        {/* Current Password */}
        <div className="relative mb-3">
          <input
            type={showCurrent ? "text" : "password"}
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border p-3 rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-3 rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
