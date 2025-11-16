import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import urls from "../../services/urls";
import { jwtDecode } from "jwt-decode";
import Table from "../table/Table";
import AddNewCourse from "../buttons/AddNewCourse";
import Header from "../header/Header";

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔥 STEP 1: extract fetch function
  const fetchCourses = async () => {
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
      setError("Failed to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role || "");
      } catch (err) {
        console.error("Token decode failed:", err);
      }
    }

    fetchCourses(); // Initial load
  }, []);
const refreshCourses = () => {
  fetchCourses();   // this should re-fetch from API
};
  if (loading) return <p className="text-center mt-5">Loading courses...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <>
      <Header />

      <div className="container">
        <h1 style={{ margin: "150px 0px 80px 0px" }}>Instructor Dashboard</h1>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4>Available Courses</h4>

          {/* 🔥 PASS FETCH FUNCTION HERE */}
          <AddNewCourse onCourseAdded={refreshCourses}/>
        </div>

        <Table courses={courses} />
      </div>
    </>
  );
};

export default InstructorDashboard;
