// App.js
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/LoginSignup"; // Assuming you want to navigate to a Login component
import CourseListing from "../pages/CourseListing";
import ProtectedRoute from "./ProtectedRoutes";
import Student from "../pages/dashboards/StudentDashboard";
import AddNewCourse from "../pages/buttons/AddNewCourse";
import CourseDetails from "../pages/Courses/CourseDetails";
import CoursePurchase from "../pages/Courses/CoursePurchase";
import AdminDashboard from "../pages/dashboards/AdminDashboard";
import InstructorDashboard from "../pages/dashboards/InstructorDashboard";
import StudentDashboard from "../pages/dashboards/StudentDashboard";



function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

  
      <Route path="/courses" element={<CourseListing />} />
      <Route path="/courses/addcourse" element={<AddNewCourse />} />
      <Route path="/courses/:id" element={<CourseDetails />} />
      <Route path="/buy-course/:courseId" element={<CoursePurchase />} />
      <Route path="/instructordashboard" element={<InstructorDashboard />} />

      <Route path="/admindashboard" element={<AdminDashboard />} />
      <Route path="/studentdashboard" element={<StudentDashboard />} />

      {/* This is the target route */}
    </Routes>
  );
}
export default MainRoutes;
