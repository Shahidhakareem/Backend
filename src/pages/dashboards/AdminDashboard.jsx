import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import urls from "../../services/urls";
import { jwtDecode } from "jwt-decode";
import "../../styles/home.css";
import Table from "../table/Table";
import AddNewCourse from "../buttons/AddNewCourse";
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js";
import Header from "../header/Header";

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✨ Decode token
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role || "");
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }

    // ✨ Fetch dashboard data
    fetchDashboardData();
    generateChart();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const response = await axios.get(`${urls.baseURL.dev}${urls.courseList}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses(response.data.courses || []);
      setTotalUsers(58); // you can fetch from API if available
    } catch (err) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Initialize Chart.js
  const generateChart = () => {
    setTimeout(() => {
      const ctx = document.getElementById("dashboardChart");

      if (!ctx) return;

      new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May"],
          datasets: [
            {
              label: "Platform Totals",
              data: [10, 25, 20, 40, 35],
              borderWidth: 3,
              borderColor: "#007bff",
              backgroundColor: "rgba(0, 123, 255, 0.2)",
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
          },
        },
      });
    }, 500);
  };

  if (loading) return <p className="text-center mt-5">Loading dashboard...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <>
    <Header/>
    <div className="container py-5">

      {/* Header */}
      <h1 style={{margin: "150px 0px 80px 0px"}} >Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Total Users</h6>
              <h3 className="fw-bold">{totalUsers}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Total Courses</h6>
              <h3 className="fw-bold">{courses.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h6 className="text-muted">Revenue (WIP)</h6>
              <h3 className="fw-bold">$0</h3>
            </div>
          </div>
        </div>
      
  
      {/* Chart */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">Platform Overview</h5>
          <canvas id="dashboardChart" height="100"></canvas>
        </div>
      </div>
    
  </div>
      {/* Course Table */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4>Available Courses</h4>
        <AddNewCourse />
      </div>

      <Table courses={courses} />
    </div>
    </>
  );
};

export default AdminDashboard;
