import Navbar from "../../components/Homecomponent/Navbar";
import Footer from "../../components/Homecomponent/Footer";
import homeImage3 from "../../assets/5cdef84d1fd848e683422833c735ead9.webp";
import ConfirmModal from "../../components/Homecomponent/ConfirmModal";
import heroImage from "../../assets/home1.jpg";
import heroImage2 from "../../assets/home2.jpg";
import boxImage1 from "../../assets/m1.jpg";
import boxImage2 from "../../assets/m2.jpg";
import boxImage3 from "../../assets/m3.jpg";
import boxImage4 from "../../assets/m4.jpg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const handleConfirm = () => {
    setIsModalOpen(false);
    navigate("/mentor-registration");
  };

  return (
    <>
      <Navbar />

      <section className="bg-[#F6F6F6] py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <h1
              className="text-4xl pl-8 md:text-6xl font-extralight text-gray-800 leading-tight mb-4"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Connect. Learn.
              <br />
              <span className="text-yellow-500 pl-30">Grow</span> with Your
              <br />
              <span className="text-red-500 pl-8">Personal Mentor</span>
            </h1>

            <p className="text-gray-600 text-sm md:text-base mb-8 ">
              A one-on-one learning platform where students connect with expert
              mentors through live sessions, real-time chat, and personalized
              guidance. It ensures interactive learning, quick doubt resolution,
              progress tracking, and support tailored to each student's unique
              needs for a more focused and effective educational experience.
            </p>

            <div className="flex gap-4 pl-60 pt-25">
              <button
                className="bg-teal-700 text-white px-6 py-2 rounded-full text-sm hover:bg-teal-800"
                onClick={() => navigate("/mentorPage")}
              >
                Find a Mentor
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gray-100 text-gray-800 px-6 py-2 rounded-full text-sm hover:bg-gray-200"
              >
                Become a Mentor
              </button>
              <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirm}
                message="Are you sure you want to become a mentor?"
              />
            </div>
          </div>

          <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px]">
            <div className="absolute inset-0  rounded-full border-2 border-green-200 scale-110 z-0" />

            <div className="absolute top-[0px] left-[-25px] w-30 h-30 bg-[#0F1C4D] rounded-3xl z-0 rotate-12" />

            <div className="absolute bottom-[-10px] right-[-20px] w-30 h-30 bg-[#D7D9ED] rounded-3xl z-0 -rotate-5" />

            <img
              src={heroImage}
              alt="Mentor Session"
              className="relative z-10 rounded-4xl object-cover w-300 h-85 shadow-md top-10"
            />
          </div>
        </div>

        <div className="relative w-full flex flex-col md:flex-row items-center justify-center mt-16 px-6 md:px-20">
          <div className="w-full md:w-3/4 h-[500px] relative right-50 ">
            <img
              src={heroImage2}
              alt="About Mentora"
              className="w-full h-full  object-cover rounded-2xl shadow-lg "
            />

            <div className="absolute top-0 l left-170  bg-white/40 backdrop-blur-md p-6  rounded-lg shadow-md w-[90%] md:w-2/3 h-125">
              <h3
                className="text-4xl font-semibold mb-4 text-gray-800"
                style={{ fontFamily: "Raleway, sans-serif" }}
              >
                Welcome to Mentora
              </h3>

              <p className="text-sm text-gray-700 mb-3">
                At Mentora, we specialize in providing high-quality
                psychological consultation and mental health support tailored to
                your unique needs. Whether you're facing emotional challenges,
                cognitive difficulties, or seeking personal growth, our
                dedicated team of psychologists, counselors, and mental health
                professionals is here to guide you with compassion and care.
              </p>
              <p className="text-sm text-gray-700 mb-3">
                We offer flexible consultation options — connect with your
                psychologist online or in person, based on your comfort and
                convenience. Our approach is rooted in empathy, confidentiality,
                and evidence-based psychological practices to ensure you receive
                effective, personalized care.
              </p>
              <p className="text-sm text-gray-700">
                At Mentora, we are committed to creating a safe and supportive
                space for your mental wellness journey.
                <br />
                <br />
                <strong className="text-gray-900">Our Services Include:</strong>
                <br />
                - Psychological Consultation & Therapy
                <br />
                - Individual & Family Counseling
                <br />
                - Online & In-person Sessions
                <br />- Holistic Mental Wellness Support
              </p>
            </div>
          </div>
        </div>

        <div className="relative w-full flex flex-col md:flex-row items-center justify-center mt-16 px-6 md:px-20">
          <div className="w-full md:w-3/4 h-[500px] relative left-48">
            <img
              src={homeImage3}
              alt="About Mentora"
              className="w-full h-full object-cover rounded-2xl shadow-lg"
            />

            <div className="absolute top-0 right-10 md:right-175 bg-white/40 backdrop-blur-md p-6 rounded-lg shadow-md w-[90%] md:w-2/3 h-full overflow-auto">
              <h3
                className="text-4xl font-semibold mb-4 text-gray-800"
                style={{ fontFamily: "Raleway, sans-serif" }}
              >
                One-to-One Coaching for <br />
                Empowered Living
              </h3>

              <p className="text-sm text-gray-700 mb-3">
                Step into a personalised journey of growth and self-discovery
                with my one-on-one life coaching sessions conducted via
                Microsoft Teams or Google Meet, depending on your preference. As
                your dedicated guide, I am committed to providing unwavering
                support aimed at empowering you to reach your ultimate goals.
                <br />
                <p></p>
                <br /> Together, we navigate the intricacies of your
                aspirations, employing a curated blend of proven techniques and
                models to propel you forward.{" "}
              </p>

              <p className="text-sm text-gray-700 mb-3">
                In the immersive realm of our sessions, you can expect a
                collaborative approach where we tailor strategies to align with
                your unique needs.
                <br />
                <p></p>
                <br /> These transformative techniques are designed to not only
                address the challenges at hand but to guide you steadily toward
                your chosen desires. Embrace the power of personalised life
                coaching, and let's embark on a transformative journey that
                brings you closer to the fulfilling life you envision.{" "}
              </p>
            </div>
          </div>
        </div>

        {/*  Meet Our Mentors Section */}
        <div className="bg-white py-16 px-6 md:px-20 mt-25">
          <div className="max-w-7xl mx-auto text-center">
            <h2
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "Raleway, sans-serif" }}
            >
              Meet Some of Our Inspiring Mentors
            </h2>
            <p className="text-gray-500 text-base md:text-lg mb-12">
              Discover experienced professionals ready to share their knowledge
              and guide your journey.
            </p>

            {/* Mentor Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-[#F6F6F6] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <img
                  src={boxImage1}
                  alt="Mentor 1"
                  className="w-60 h-60 rounded-2xl  mx-auto mb-4 object-cover  hover:shadow-lg"
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  Dr. Ananya Sharma
                </h3>
                <p className="text-sm text-gray-600">Clinical Psychologist</p>
              </div>

              <div className="bg-[#F6F6F6] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <img
                  src={boxImage2}
                  alt="Mentor 2"
                  className="w-60 h-60 rounded-2xl  mx-auto mb-4 object-cover  hover:shadow-lg"
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  Arjun Nair
                </h3>
                <p className="text-sm text-gray-600">Life Coach</p>
              </div>

              <div className="bg-[#F6F6F6] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <img
                  src={boxImage3}
                  alt="Mentor 3"
                  className="w-60 h-60 rounded-2xl  mx-auto mb-4 object-cover  hover:shadow-lg"
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  Meera Joseph
                </h3>
                <p className="text-sm text-gray-600">Wellness Expert</p>
              </div>

              <div className="bg-[#F6F6F6] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <img
                  src={boxImage4}
                  alt="Mentor 4"
                  className="w-60 h-60 rounded-2xl  mx-auto mb-4 object-cover hover:shadow-lg "
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  Dr. Rajeev Menon
                </h3>
                <p className="text-sm text-gray-600">Counselor & Therapist</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F6F6F6] py-20 px-6 md:px-20 mt-20">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Start Your Mentorship Journey
          </h2>
          <p
            className="text-center text-gray-600 mb-12 text-sm md:text-base"
            style={{ fontFamily: "Raleway, sans-serif" }}
          >
            Getting started is simple. Follow these three easy steps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition duration-300">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                1. Find Your Mentor
              </h3>
              <p className="text-sm text-gray-500">
                Browse profiles or search by category to find the perfect expert
                for your needs.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition duration-300">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                2. Schedule a Session
              </h3>
              <p className="text-sm text-gray-500">
                Check mentor availability and book a 1:1 session at a time that
                works for you.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition duration-300">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 text-green-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 8h10M7 12h6m4 6H5l-2 2V6a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                3. Connect & Grow
              </h3>
              <p className="text-sm text-gray-500">
                Meet your mentor, gain valuable insights, and accelerate your
                progress.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
};

export default Home;
