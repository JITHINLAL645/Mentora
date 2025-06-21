import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import "ldrs/react/Bouncy.css";

// Lazy loaded components
const Home = lazy(() => import("../pages/user/Home"));
const Login = lazy(() => import("../pages/user/login"));
const AboutUs = lazy(() => import("../pages/user/Aboutus"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const Mentees = lazy(() => import("../pages/admin/mentees"));
const MentorPage=lazy(()=>import("../pages/user/mentorPage"))

import Profile from "../pages/user/Profile";
import AdminMentorRegister from "../pages/admin/mentorRegistrationForm";
import AdminMentorPage from "../pages/admin/mentor"

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

        {/* Admin Route */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/mentees" element={<Mentees />} />
        <Route path="/admin/mentors" element={<AdminMentorPage />} />
        <Route path="/admin/mentor-registration" element={<AdminMentorRegister />} />




      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
