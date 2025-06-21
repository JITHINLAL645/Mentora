// src/pages/user/login.tsx
import React, { Suspense } from "react";
import { useLocation } from "react-router-dom";
// import loginimg from "../../assets/loginimg.jpg";
import loginimg2 from "../../assets/logoimg2.jpg"
import Mentoralogo from "../../assets/mentoraA.png"

const LoginForm = React.lazy(
  () => import("../../components/AuthForms/LoginForm")
);
const SignupForm = React.lazy(
  () => import("../../components/AuthForms/SignupForm")
);
const ForgotPasswordForm = React.lazy(
  () => import("../../components/AuthForms/ForgotPasswordForm")
);
const OtpVerification = React.lazy(
  () => import("../../components/AuthForms/otpVerification")
);

const Login: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname.toLowerCase();

  const renderForm = () => {
    if (pathname.includes("signup")) {
      return <SignupForm />;
    } else if (pathname.includes("forgotpassword")) {
      return <ForgotPasswordForm />;
    } else if (pathname.includes("otpverification")) {
      return <OtpVerification />;
    } else {
      return <LoginForm />;
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white"
      key={pathname}
    >
      <div className="flex w-[1000px] h-[600px] shadow-2xl rounded-xl overflow-hidden bg-white">
        {/* Image Section */}
        <div
          className="w-150 h-110 mt-25 bg-cover bg-center"
          style={{ backgroundImage: `url(${loginimg2})` }}
        >
          <div className="flex items-center relative w-10 h-10">
        <img
          src={Mentoralogo}
          alt="Mentora Logo"
          className="absolute bottom-20 left-60 scale-[6.2] object-contain "
        />
      </div>
        </div>

        {/* Divider */}
        <div className="w-[1px] bg-gray-300"></div>

        {/* Form Section */}
        <div className="w-1/2 flex items-center justify-center p-10 bg-[#f6f6f6]">
          <Suspense fallback={<div>Loading...</div>}>{renderForm()}</Suspense>
        </div>
      </div>
    </div>
  );
};

export default Login;
