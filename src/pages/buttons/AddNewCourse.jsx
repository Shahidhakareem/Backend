import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import urls from "../../services/urls";

const AddNewCourse = ({onCourseAdded}) => {
  const [courseName, setCourseName] = useState("");
  const [description, setCourseDesc] = useState("");
  const [price, setPrice] = useState("");

  const [courseVideo, setCourseVideo] = useState(null);

  const [role, setRole] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load user role from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("User Role:", decoded.role);
        setRole(decoded.role);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, []);

  const handleAddCourse = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("User not authenticated.");
      return;
    }

    if (!courseName || !description || !price || !courseVideo) {
      setError("All fields including image and video are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", courseName);
    formData.append("description", description);
    formData.append("price", price);

    formData.append("courseVideo", courseVideo);

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${urls.baseURL.dev}${urls.addCourse}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Course added successfully!");


      // Reset Form
      setCourseName("");
      setCourseDesc("");
      setPrice("");
      setCourseVideo(null);

      
      setTimeout(() => {
  const modalEl = document.getElementById("addCourseModal");
  let modal = window.bootstrap.Modal.getInstance(modalEl);

  if (!modal) {
    modal = new window.bootstrap.Modal(modalEl);
  }

  modal.hide();

  // HARD RESET (Fix stuck fade + backdrop)
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";

  const backdrops = document.getElementsByClassName("modal-backdrop");
  while (backdrops.length > 0) {
    backdrops[0].parentNode.removeChild(backdrops[0]);
  }
}, 300);

 // slight delay so success message shows briefly


      if (onCourseAdded) {
        onCourseAdded(); // 🔥 REFRESH COURSE LISTING
      }
      console.log("Course Added:", response.data);
    } catch (err) {
      console.error("Error adding course:", err);
      setError(err.response?.data?.message || "Failed to add course.");
    } finally {
      setLoading(false);
    }
  };

  // Hide button if student
  if (role === "student") {
    return null;
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addCourseModal"
      >
        Add New Course
      </button>

      {/* Modal */}
      <div
        className="modal fade"
        id="addCourseModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header p-5">
              <h5 className="modal-title">Add New Course</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body text-end p-5" >
              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}

              <div className="mb-3">
                <label className="form-label">Course Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Enter course name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Course Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={description}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  placeholder="Enter course description"
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Course Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter course price"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Upload Course Video</label>
                <input
                  type="file"
                  className="form-control"
                  accept="video/*"
                  onChange={(e) => setCourseVideo(e.target.files[0])}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>

              <button
                className="btn btn-primary"
                onClick={handleAddCourse}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Course"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewCourse;
