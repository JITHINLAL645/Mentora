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
              className="text-4xl pl-8 md:text-6xl font-extralight leading-tight mb-4 bg-clip-text text-transparent"
              style={{
                fontFamily: "Playfair Display, serif",
                backgroundImage:
                  'url("data:image/jpeg;base64,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")',
                backgroundSize: "cover",
                WebkitBackgroundClip: "text",
              }}
            >
              Connect. Learn.
              <br />
              <span className="pl-30">Grow with Your</span>
              <br />
              <span className="pl-10"> Personal Mentor</span>
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
                <br />
                {/* <p></p> */}
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
