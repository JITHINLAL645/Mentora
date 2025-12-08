import { Navigate } from "react-router-dom";

interface ProtectedMentorRouteProps {
  children: React.ReactNode;
}

const ProtectedMentorRoute: React.FC<ProtectedMentorRouteProps> = ({ children }) => {
  const mentorToken = localStorage.getItem("mentorToken");

  if (!mentorToken) {
    return <Navigate to="/mentor/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedMentorRoute;