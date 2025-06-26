import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import "ldrs/react/Bouncy.css";

const Home = lazy(() => import("../pages/user/Home"));
const Login = lazy(() => import("../pages/user/login"));
const AboutUs = lazy(() => import("../pages/user/Aboutus"));
const MentorPage = lazy(() => import("../pages/user/mentorPage"));
import MentorProfile from "../pages/user/SingleMentorPage";
import Profile from "../pages/user/Profile";

const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const Mentees = lazy(() => import("../pages/admin/mentees"));
const AdminMentorRegister = lazy(() => import("../pages/admin/mentorRegistrationForm"));
const AdminMentorPage = lazy(() => import("../pages/admin/mentor"));

import ProtectedAdminRoute from "./ProtectedAdminRoute";
import MentorDashboard from "../pages/mentor/MentorDashboard";
import MentorSingleProfile from "../pages/mentor/MentorProfile";
import MentorRegistrationPage from "../pages/mentor/MentorRegistration";
import MentorLogin from "../pages/mentor/MentorLogin";

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="bg-[#F6F6F6] h-screen flex items-center justify-center">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 border-4 border-[#3d5a80] border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-[#98c1d9] border-b-transparent rounded-full animate-spin [animation-direction:reverse]"></div>
          </div>
        </div>
      }
    >
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/forgotPassword" element={<Login />} />
        <Route path="/otpVerification" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/mentorPage" element={<MentorPage />} />
        <Route path="/singlementorPage/:id" element={<MentorProfile />} />

        {/* Mentor Routes */}
        <Route path="/mentorDashboard" element={<MentorDashboard />} />
        <Route path="/mentorProfile" element={<MentorSingleProfile />} />
        <Route path="/mentor-registration" element={<MentorRegistrationPage />} />
        <Route path="/mentorLogin" element={<MentorLogin />} />

        


        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/mentees"
          element={
            <ProtectedAdminRoute>
              <Mentees />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/mentors"
          element={
            <ProtectedAdminRoute>
              <AdminMentorPage />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/mentor-registration"
          element={
            <ProtectedAdminRoute>
              <AdminMentorRegister />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
