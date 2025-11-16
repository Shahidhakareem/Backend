import React from "react";
import "../styles/home.css"; // make sure this path matches your folder
import logoimg from "../images/main-logo.png";
import footerimg from "../images/main-logo2.png";
import workingImg from "../images/web-developerimg.webp";
//import workingImg from "../../images/web-developerimg.webp";
import workimg from "../images/web-developer-working-on.webp";
import women from "../images/learn-with-us.webp";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // 1. Get the navigate function
  const navigate = useNavigate();

  // 2. Define the click handler
  const handleLoginClick = () => {
    // This function changes the URL without a full page reload
    navigate("/login"); // Navigate to the path defined in your Routes
  };

  return (
    <div>
      {/* ===== Header Section ===== */}

      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
          <div className="container">
            <a
              className="navbar-brand"
              href="#"
              onClick={() => {
                navigate("/");
              }}
            >
              <img src={logoimg} alt="web world logo" width="80px" />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse justify-content-end"
              id="navbarNav"
            >
              <ul className="navbar-nav fw-bold nav-links">
                <li className="nav-item">
                  <button id="learn" onClick={handleLoginClick}>
                    Login
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <div className="container-fluid main-bg">
        <div className="container-fluid pt-5">
          <div
            id="carouselExampleControls"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner ">
              <div className="carousel-item active ">
                <div className="container">
                  <div className="row align-items-center">
                    <div className="col-6 bg-white p-5 rounded-3">
                      <div>
                        <h3 className="text-dark">
                          Learn essential career and life skills
                        </h3>
                        <button
                          className="learn mt-5"
                          onClick={() =>
                           navigate("/login")
                          }
                        >
                          Get Courses
                        </button>
                      </div>
                    </div>
                    <div className="col-6  ">
                      <img src={women} className=" women-img  " alt="..." />
                    </div>
                  </div>
                </div>
              </div>
              <div className="carousel-item ">
                <div className="container">
                  <div className="row align-items-center">
                    <div className="col-6  ">
                      <img src={workimg} className=" women-img  " alt="..." />
                    </div>
                    <div className="col-6  p-5">
                      <div>
                        <h3 className="text-white">
                          Reimagine your career in the AI era
                        </h3>
                        <p className="text-white">
                          Future-proof your skills with Personal Plan. Get
                          access to a variety of fresh content from real-world
                          experts.
                        </p>
                        <button
                          className="learn learn-more mt-5 "
                          onClick={() =>
                            navigate("/login")
                          }
                        >
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===== Introduction Section ===== */}
      <section id="introduction" className="text-center">
        <h1>Our Mission</h1>
        <h2>Accelerate Your Career with Real-World Development</h2>
        <p>
          The WebWorld learning hub courses designed to transition enthusiastic
          learners from theory to professional practice. You'll work on live
          projects, collaborate with experienced engineers, and master the full
          development lifecycle in a supportive, fast-paced environment. This
          isn't just shadowing; it's about building a portfolio that gets you
          hired.
        </p>

        <div className="image-container element">
          <img src={workingImg} alt="Web Developer" />
          <img src={workimg} alt="Developer Project" />
        </div>
      </section>

      {/* ===== Benefits Section ===== */}
      <div id="benefits" className="text-center my-5">
        <h1 className="mb-4">Why choose with WebWorld?</h1>

        <div className="container">
          <div className="row g-4">
            {[
              {
                title: "Real-World Project Experience",
                desc: "Contribute directly to high-impact company projects, learning how software is built and deployed in a professional setting.",
              },
              {
                title: "Dedicated Mentorship",
                desc: "Receive one-on-one guidance from senior developers who are committed to your technical and professional growth.",
              },
              {
                title: "Skill Mastery",
                desc: "Deepen your knowledge of modern frameworks and tools, going beyond basic concepts into advanced application development.",
              },
              {
                title: "Certification & Networking",
                desc: "Earn an internship completion certificate and build valuable connections with industry professionals.",
              },
              {
                title: "Pathway to Full-Time",
                desc: "High-performing interns will be considered for a full-time position upon successful completion of the program.",
              },
            ].map((benefit, index) => (
              <div className="col-12 col-md-6 col-lg-4" key={index}>
                <div className="card h-100  p-3 text-start">
                  <h4 className="fw-bold">{benefit.title}</h4>
                  <p className="text-muted">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
              <div id="cta">
 
          <button
            className="text-center"
            onClick={() =>
            navigate("/login")
            }
          >
            Start Learn
          </button>
        </div>
        </div>
    
      </div>

 

      {/* ===== Footer ===== */}
      <footer className="bg-dark text-white text-center text-lg-start">
        <div className="container py-5">
          <div className="row align-items-center gy-4">
            {/* Left: Logo and tagline */}
            <div className="col-12 col-lg-6 text-center text-lg-start">
              <a
                href="#"
                className="d-inline-flex align-items-center text-decoration-none text-white mb-3"
              >
                <img
                  src={footerimg}
                  alt="WebWorld"
                  className="me-2"
                  style={{ width: "160px", maxWidth: "100%" }}
                />
              </a>
              <p
                className="mb-0 mx-auto mx-lg-0"
                style={{
                  maxWidth: "500px",
                  fontSize: "15px",
                  lineHeight: "1.6",
                }}
              >
                Face challenges as opportunities, much like WebWorld navigates
                innovation. With determination and belief in your potential,
                every hurdle becomes a stepping stone to success.
              </p>
            </div>

            {/* Right: Contact details */}
            <div className="col-12 col-lg-6 text-center text-lg-end">
              <p className="mb-2">
                Contact us:{" "}
                <a
                  href="mailto:cognifyztechnologies@gmail.com"
                  className="text-white text-decoration-underline"
                >
                  webworld@gmail.com
                </a>
              </p>
              <p className="mb-1">Phone: +1-234-567-890</p>
              <p className="mb-0">Location: Nagpur, Maharashtra</p>
            </div>
          </div>
        </div>

        <div
          className="text-center py-3 border-top border-secondary"
          style={{ fontSize: "14px" }}
        >
          © {new Date().getFullYear()} WebWorld Learning Hub. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
