import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { toast } from "sonner";
import {
  sendOtpApi,
  verifyOtpApi,
  changeEmailApi,
} from "../../api/user/changeEmailApi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangeEmailModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [currentEmail, setCurrentEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyCurrentEmail = async () => {
    try {
      setLoading(true);
      await sendOtpApi(currentEmail);
      toast.success("OTP sent to your current email");
      setStep(2);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      await verifyOtpApi(currentEmail, otp);
      toast.success("OTP verified successfully");
      setStep(3);
    } catch (err) {
      console.error(err);
      toast.error("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      setLoading(true);
      await changeEmailApi(currentEmail, newEmail);
      toast.success("Email updated successfully");

      onClose();
      setStep(1);
      setCurrentEmail("");
      setOtp("");
      setNewEmail("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-6 rounded-xl shadow-lg w-96">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Change Email
          </Dialog.Title>

          {step === 1 && (
            <>
              <label className="block mb-2">Current Email</label>
              <input
                type="email"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <button
                onClick={handleVerifyCurrentEmail}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
                disabled={loading}
              >
                {loading ? "Please wait..." : "Next"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <label className="block mb-2">Enter OTP</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <button
                onClick={handleVerifyOtp}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <label className="block mb-2">New Email</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
              <button
                onClick={handleUpdateEmail}
                className="mt-4 w-full bg-green-600 text-white py-2 rounded"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Email"}
              </button>
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
