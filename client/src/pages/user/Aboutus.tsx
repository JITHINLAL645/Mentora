import aboutImage from "../../assets/aboutus.png";
import Footer from "../../components/Homecomponent/Footer";
import Navbar from "../../components/Homecomponent/Navbar";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <section className="bg-[#F6F6F6] py-12">
        <h2 className="text-2xl md:text-3xl font-bold ml-10 flex items-center gap-2">
          <Link to="/">
            <ChevronLeftIcon className="w-6 h-6 text-shadow-black hover:bg-gray-200 cursor-pointer" />
          </Link>
          About Us
        </h2>
        <div className="relative w-full h-[1000px] mt-10 rounded-2xl overflow-hidden max-w-7xl mx-auto shadow-lg">
          <img
            src={aboutImage}
            alt="About Mentora"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0  backdrop-blur-xs p-6 md:p-12 flex flex-col md:flex-row items-start justify-between space-y-6 md:space-y-0">
            <div className=" space-y-6 text-gray-800">
              <div className="ml-20 pr-20 ">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 ">
                  Welcome to{" "}
                  <span className="font-bold">
                    <span style={{ color: "#088F8F" }}>Men</span>
                    <span style={{ color: "#5F9EA0" }}>tora</span>
                  </span>
                  – Your Personal Space <br /> for Mental Wellness
                </h2>
                <p className="text-sm md:text-base leading-relaxed">
                  At Mentora, we believe that mental health care should be
                  accessible, personal, and stigma-free. Whether you're feeling
                  overwhelmed, stuck, lost in thought, or simply need someone to
                  listen, we’re here to help — with compassion, confidentiality,
                  and professionalism. Our team of licensed psychologists,
                  experienced counselors, and dedicated mental health
                  professionals is committed to supporting your journey through
                  evidence-based practices and empathetic guidance. We offer
                  flexible therapy formats including secure video consultations,
                  live chat sessions, and personalized therapy plans, so you can
                  choose the mode of support that feels most comfortable and
                  convenient for your lifestyle. We understand that every
                  individual’s experience is unique, shaped by personal history,
                  challenges, and hopes. That’s why at Mentora, we focus on
                  personalized care, active listening, and holistic support —
                  not just treating symptoms, but nurturing long-term
                  well-being. We aim to build a safe, non-judgmental space where
                  your voice is valued and your story matters. Whether you're
                  taking your first step toward healing or continuing your
                  growth journey, Mentora is here to walk with you — every step
                  of the way.
                </p>
              </div>

              {/* Vision Section */}
              <div className="mr-60 pt-10">
                <h3 className="text-lg font-bold mb-1">Vision</h3>
                <p className="text-sm md:text-base leading-relaxed">
                  At Mentora, we envision a world where mental wellness is not
                  only prioritized but celebrated as the true foundation of a
                  fulfilling and meaningful life. We dream of a society where
                  taking care of your mind is seen as a strength — a vital part
                  of overall well-being, just like physical health. We aspire to
                  lead the evolution of psychological care through empathy,
                  innovation, and accessibility. By combining compassionate
                  human connection with modern technology, we aim to remove the
                  barriers that often prevent people from seeking the help they
                  need — whether it's fear, stigma, distance, or lack of
                  awareness. We see a future where mental health is a shared
                  priority, where schools, workplaces, families, and communities
                  come together to uplift each other, creating a culture of
                  empathy and care.
                </p>
              </div>

              {/* Mission Section */}
              <div className="mr-60 pt-10">
                <h3 className="text-lg font-bold mb-1">Mission</h3>
                <p className="text-sm md:text-base leading-relaxed">
                  Our mission at Mentora is to guide individuals through their
                  unique mental health journeys with unwavering care, clarity,
                  and compassion. We understand that no two experiences are the
                  same, which is why we approach every person’s story with deep
                  respect and sensitivity. We are committed to delivering
                  confidential and personalized psychological support through
                  modern, secure platforms — including video calls, chat
                  sessions, and interactive tools — designed to meet people
                  where they are, both emotionally and physically. By
                  eliminating traditional barriers such as distance, stigma,
                  fear of judgment, and lack of time, we aim to make mental
                  health care as easy and natural as reaching out to a friend.
                  At Mentora, we don't just offer therapy — we create safe
                  spaces, foster meaningful connections, and empower individuals
                  to not just survive, but thrive. We are here to walk beside
                  you, every step of the way, on your path toward mental
                  clarity, emotional strength, and a brighter tomorrow.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
};

export default AboutUs;
