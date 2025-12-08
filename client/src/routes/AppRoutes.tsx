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
const AdminMentorRegister = lazy(
  () => import("../pages/admin/mentorRegistrationForm")
);
const AdminMentorPage = lazy(() => import("../pages/admin/mentor"));

import ProtectedAdminRoute from "./ProtectedAdminRoute";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ProtectedMentorRoute from "./ProtectedMentorRoute";
import MentorDashboard from "../pages/mentor/MentorDashboard";
import MentorSingleProfile from "../pages/mentor/MentorProfile";
import MentorRegistrationPage from "../pages/mentor/MentorRegistration";
import MentorLogin from "../pages/mentor/MentorLogin";
import MentorCheckout from "../pages/user/MentorCheckoutPage";
import PaymentSuccess from "../pages/user/PaymentSuccess";
import MentorSlotManager from "../pages/mentor/MentorSlot";
import BookedSessions from "../pages/user/BookedSessions";
import AllMentorAppointments from "../pages/mentor/AllMentorAppointments";
import MenteeChatPage from "../pages/user/MenteeChatPage";
import MentorChatPage from "../pages/mentor/MentorChatPage";
import MentorSlotPage from "../pages/admin/MentorSlotPage";

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <div className="bg-[#F6F6F6] h-screen flex items-center justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-[#3d5a80] border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-[#98c1d9] border-b-transparent rounded-full animate-spin [animation-direction:reverse]"></div>
            <div className="absolute inset-4 border-4 border-[#b8b9b9] border-l-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      }
    >
      <Routes>
        {/* Public Routes -  */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/otpVerification"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/mentor/login"
          element={
            <PublicRoute>
              <MentorLogin />
            </PublicRoute>
          }
        />

        {/* User Routes - Public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/mentorPage" element={<MentorPage />} />
        <Route path="/singlementorPage/:id" element={<MentorProfile />} />

        {/* User Routes - Protected */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sessions"
          element={
            <ProtectedRoute>
              <BookedSessions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MenteeChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentorCheckout/:id"
          element={
            <ProtectedRoute>
              <MentorCheckout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />

        {/* Mentor Routes - Protected */}
        <Route
          path="/mentorDashboard"
          element={
            <ProtectedMentorRoute>
              <MentorDashboard />
            </ProtectedMentorRoute>
          }
        />
        <Route
          path="/mentorProfile"
          element={
            <ProtectedMentorRoute>
              <MentorSingleProfile />
            </ProtectedMentorRoute>
          }
        />
        <Route
          path="/mentor-Slot"
          element={
            <ProtectedMentorRoute>
              <MentorSlotManager />
            </ProtectedMentorRoute>
          }
        />
        <Route
          path="/showAll-Slot"
          element={
            <ProtectedMentorRoute>
              <MentorSlotPage />
            </ProtectedMentorRoute>
          }
        />
        <Route
          path="/mentor-appointments"
          element={
            <ProtectedMentorRoute>
              <AllMentorAppointments />
            </ProtectedMentorRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedMentorRoute>
              <MentorChatPage />
            </ProtectedMentorRoute>
          }
        />
        <Route
          path="/mentor-registration"
          element={<MentorRegistrationPage />}
        />

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
