import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedMentorRouteProps {
  children: React.ReactNode;
}

const ProtectedMentorRoute: React.FC<ProtectedMentorRouteProps> = ({ children }) => {
  const mentorToken = sessionStorage.getItem("mentorToken");
  const mentorId = sessionStorage.getItem("mentorId");

  console.log(" ProtectedMentorRoute Check:");
  console.log("- Token exists:", !!mentorToken);
  console.log("- Mentor ID exists:", !!mentorId);
  console.log("- Token:", mentorToken?.substring(0, 20) + "...");

  if (!mentorToken || !mentorId) {
    console.log(" No authentication found, redirecting to /mentor/login");
    return <Navigate to="/mentor/login" replace />;
  }

  console.log(" Authentication verified, rendering protected content");
  return <>{children}</>;
};

export default ProtectedMentorRoute;