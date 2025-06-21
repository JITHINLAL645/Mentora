import Mentoralogo from "../../assets/mentoraA.png";

const Footer = () => {
  return (
    <footer className="bg-[#F6F6F6] pt-6 pb-10 mt-10 [box-shadow:0_-6px_6px_-4px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6 text-sm text-gray-600">
        {/* Left: Logo + Description */}
        <div>
          <div className="relative w-10 h-10">
            <img
              src={Mentoralogo}
              alt="Mentora Logo"
              className="absolute top-0 left-20 scale-[6.2] object-contain"
            />
          </div>

          <p className="text-xs text-gray-500">
            Your trusted source to find highly-vetted mentors & industry <br />
            professionals to move your career ahead.
          </p>
        </div>

        {/* Right: 6 Links in 2 Rows (3 per row) */}
        <div className="mt-2 grid grid-cols-3 gap-6 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-gray-400">
            Platform
          </a>
          <a href="#" className="hover:text-gray-400">
            Browse Mentors
          </a>
          <a href="#" className="hover:text-gray-400">
            Book a Session
          </a>
          <a href="#" className="hover:text-gray-400">
            Become a Mentor
          </a>
          <a href="#" className="hover:text-gray-400">
            Mentorship for Teams
          </a>
          <a href="#" className="hover:text-gray-400">
            Testimonials
          </a>
        </div>
      </div>

      {/* Bottom Border + Copyright */}
      <div className=" mt-6 pt-4 px-6">
        <hr className="mt-20  border-gray-300" />
        <div className="max-w-7xl mx-auto">
          <div className="text-xs text-right mt-4">
            <span className="[color:#0E0E55] font-semibold">
              @ Mentora 2025
            </span>{" "}
            <span className="text-gray-500">. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
