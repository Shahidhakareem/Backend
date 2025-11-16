import React, { useEffect, useState } from "react";
import axios from "axios";
import urls from "../../services/urls";
import "../../styles/home.css";
import { jwtDecode } from "jwt-decode";

import { useNavigate } from "react-router-dom";

const PremiumCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ Decode token and extract role
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role || "");
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }

    // ✅ Fetch courses
    const fetchCourses = async () => {
      setLoading(true);
      try {
        if (!token) {
          setError("Please log in to view courses.");
          setLoading(false);
          return;
        }

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

    fetchCourses();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading courses...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="container py-5 mt-5">
      {/* 🔹 Header Section */}
      <div className="row align-items-center mb-4">
        <div className="col-md-12 text-align-center">
         <h1 className="my-5">
     
            Master Web Development or AI with Expert-Lead Courses
            Starting at Rs500
          </h1>
        </div>
      </div>

      {/* 🔹 Courses List */}
      <div className="row">
        {courses.map((course) => (
          <div key={course._id} className="col-md-4 col mb-4">
            <div className="card shadow-sm h-100">
              {/* 🎥 Show video if available */}
              {course.courseVideo ? (
                <video
                  width="100%"
                  height="300"
                  controls
                  muted
                  style={{ objectFit: "cover", borderRadius: "8px" }}
                  onClick={() => navigate(`/studentdashboard/${course._id}`)}
                >
                  <source src={course.courseVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={
                    course.courseImage ||
                    "https://via.placeholder.com/300x200?text=No+Preview"
                  }
                  className="card-img-top"
                  alt={course.name}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}

              <div className="card-body text-center">
                <h5 className="card-title">{course.name}</h5>
                <p
                  className="text-muted small text-dark"
                  style={{  overflow: "hidden" }}
                >
                   {course.description?.substring(0, 80)}...
                </p>
                <p className="card-text">Price: ₹{course.price}</p>

                <button
                  className="btn btn-primary  cursor-pointer"
                  onClick={() => navigate(`/courses/${course._id}`)}
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Empty State */}
      {courses.length === 0 && !loading && (
        <p className="text-center">No courses found.</p>
      )}
    </div>
  );
};

export default PremiumCourses;
