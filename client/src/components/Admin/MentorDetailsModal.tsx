import type { IMentor } from "../../pages/admin/mentor";

interface Props {
  mentor: IMentor | null;
  onClose: () => void;
}

export default function MentorDetailsModal({ mentor, onClose }: Props) {
  if (!mentor) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[600px] max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-red-500 
             w-7 h-7 rounded-full flex items-center justify-center 
             hover:bg-gray-100 transition-all duration-200"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-center">Mentor Details</h2>

        {/* Profile Image */}
        <div className="flex justify-center mb-4">
          <img
            src={
              mentor.profileImg ||
              "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full border object-cover"
          />
        </div>

        {/* Details */}
        <div className="space-y-3 text-gray-800">
          <p>
            <strong>Name:</strong> {mentor.fullName}
          </p>
          <p>
            <strong>Email:</strong> {mentor.email}
          </p>
          <p>
            <strong>Phone:</strong> {mentor.phone}
          </p>
          <p>
            <strong>Gender:</strong> {mentor.gender}
          </p>
          <p>
            <strong>Specialization:</strong> {mentor.specialization}
          </p>
          <p>
            <strong>Education:</strong> {mentor.education}
          </p>
          <p>
            <strong>Experience:</strong> {mentor.experience} years
          </p>
          <p>
            <strong>About:</strong> {mentor.about}
          </p>

          <p>
            <strong>Address:</strong> {mentor.street}, {mentor.city},{" "}
            {mentor.state} - {mentor.pincode}
          </p>

          {/* <p>
            <strong>Available Days:</strong>{" "}
            {mentor.availableDays?.length ? mentor.availableDays.join(", ") : "-"}
          </p> */}

          {/* <p><strong>Rating:</strong> ⭐ {mentor.rating} ({mentor.reviewCount} reviews)</p> */}

          <p>
            <strong>Status:</strong>{" "}
            {mentor.isApproved ? (
              <span className="text-green-600">Approved</span>
            ) : (
              <span className="text-red-600">Pending</span>
            )}
          </p>

          {mentor.rejectionReason && (
            <p>
              <strong>Rejection Reason:</strong>{" "}
              <span className="text-red-500">{mentor.rejectionReason}</span>
            </p>
          )}

          {/* KYC Certificate */}
          <div>
            <strong>KYC Certificate:</strong>
            <img
              src={mentor.kycCertificate}
              alt="KYC Certificate"
              className="mt-2 w-full rounded-lg border object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
