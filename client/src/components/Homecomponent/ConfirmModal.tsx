// components/ConfirmModal.tsx
import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
    message: string;

}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-200 h-80 p-12 rounded-2xl shadow-2xl">
        <h2 className="text-3xl font-semibold mb-8 text-gray-800">
          Confirm Your Interest in Becoming a Mentor
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          By clicking "Yes", you will proceed to the mentor registration page
          where you'll be asked to provide your personal and professional
          details. Please make sure you're ready to guide and inspire mentees
          through your experience.
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            No, Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 text-sm font-medium rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Yes, Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
