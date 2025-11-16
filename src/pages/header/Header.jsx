import React, { useEffect, useState } from "react";
import logoimg from "../../images/main-logo.png";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import urls from "../../services/urls";

const Header = () => {
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");   // ✅ FIXED
  const [courses, setCourses] = useState([]); // ✅ FIXED

  const navigate = useNavigate();

  const handleLoginClick = () => {
    localStorage.removeItem("token"); // logout
    navigate("/login");
  };

  const fetchCourses = async (token) => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${urls.baseURL.dev}${urls.courseList}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCourses(response.data.courses || []);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Unauthorized access. Please log in again.");
      } else {
        setError("Failed to load courses. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load token and role + fetch courses
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role || "");

        // Fetch courses only if logged in
        fetchCourses(token);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    } else {
      setError("Please log in to view courses.");
    }
  }, []);

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
        <div className="container">
          <a className="navbar-brand" onClick={() => navigate("/")}>
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
            <ul className="navbar-nav fw-bold nav-links align-items-center">
              {/* ADMIN */}
              {userRole === "admin" && (
                <>
                  <li
                    className="nav-item text-black"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/courses")}
                  >
                    Home
                  </li>

                  <li
                    className="nav-item text-black"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/admindashboard")}
                  >
                    Dashboard
                  </li>
                </>
              )}

              {/* INSTRUCTOR */}
              {userRole === "instructor" && (
                <>
                  <li
                    className="nav-item text-black"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/courses")}
                  >
                    Home
                  </li>

                  <li
                    className="nav-item text-black"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/instructordashboard")}
                  >
                    Dashboard
                  </li>
                </>
              )}

              {/* STUDENT */}
              {userRole === "student" && (
                <>
                  <li
                    className="nav-item text-black"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/courses")}
                  >
                    Home
                  </li>

                  <li
                    className="nav-item text-black"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/studentdashboard")}
                  >
                    Dashboard
                  </li>
                </>
              )}

              <li className="nav-item">
                <button id="learn" onClick={handleLoginClick}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Show error message */}
      {error && (
        <p className="text-danger text-center mt-2">{error}</p>
      )}
    </header>
  );
};

export default Header;
