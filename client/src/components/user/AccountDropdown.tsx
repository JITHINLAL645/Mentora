import React, { useEffect, useRef } from "react";

interface Props {
  onChangePassword: () => void;
  onChangeEmail: () => void;
  onClose: () => void;
}

const AccountDropdown: React.FC<Props> = ({
  onChangePassword,
  onChangeEmail,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute right-0 bottom-full mb-3 w-60 bg-white shadow-xl rounded-xl border border-gray-200 z-50 p-2 animate-fadeUp"
    >
      <button
        onClick={() => {
          onChangePassword();
          onClose();
        }}
        className="block w-full text-left px-4 py-3 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition"
      >
        🔒 Change Password
      </button>

      <button
        onClick={() => {
          onChangeEmail();
          onClose();
        }}
        className="block w-full text-left px-4 py-3 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition"
      >
        📧 Change Email
      </button>
    </div>
  );
};

export default AccountDropdown;
