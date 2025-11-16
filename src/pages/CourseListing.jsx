import React, { useEffect, useState } from "react";
import axios from "axios";
import urls from "../services/urls";
import logoimg from "../images/main-logo.png";
import "../styles/home.css";
import { jwtDecode } from "jwt-decode";

import { useNavigate } from "react-router-dom";
import PremiumCourses from "./Courses/PremiumCourses";

import AddNewCourse from "./buttons/AddNewCourse";
import Header from "./header/Header";

const CourseListing = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");

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
    <div className="container py-5">

      {/* Header */}
      <Header />

      {/* 🔹 Courses List */}

      <PremiumCourses />

      {/* 🔹 Empty State */}
      {courses.length === 0 && !loading && (
        <p className="text-center">No courses found.</p>
      )}
    </div>
  );
};

export default CourseListing;
