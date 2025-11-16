import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import urls from "../../services/urls";
import { jwtDecode } from "jwt-decode";

const Table = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${urls.baseURL.dev}/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Course deleted successfully");
      setCourses(courses.filter((course) => course._id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete course");
    }
  };

  const [editData, setEditData] = useState({
    _id: "",
    name: "",
    description: "",
    price: "",
  });

  const handleEdit = async () => {
    try {
      const token = localStorage.getItem("token");

      const updated = {
        name: editData.name,
        description: editData.description,
        price: editData.price,
      };

      await axios.patch(
        `${urls.baseURL.dev}/courses/${editData._id}`,
        updated,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Course updated!");
      window.location.reload();
    } catch (err) {
      console.error("Edit Error:", err);
      alert("Failed to update course");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role || "");
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }

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
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading courses...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;

  return (
    <div className="container mt-5">
      <div className="table-responsive">
        <table
          className="table table-bordered table-striped text-center shadow-sm"
          style={{ width: "100%", minWidth: "1200px" }}
        >
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Course Name</th>
              <th>Description Name</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course, index) => (
              <tr key={course._id}>
                <td>{index + 1}</td>
                <td className="fw-semibold">{course.name}</td>
                <td className="fw-semibold">{course.description}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm px-3"
                    onClick={() =>
                      setEditData({
                        _id: course._id,
                        name: course.name,
                        description: course.description,
                        price: course.price,
                      })
                    }
                    data-bs-toggle="modal"
                    data-bs-target="#editModal"
                  >
                    Edit
                  </button>
                </td>

                <td>
                  <button
                    className="btn btn-danger btn-sm px-3"
                    onClick={() => handleDelete(course._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          className="modal fade"
          id="editModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Course</h5>
                <button className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div className="modal-body">
                <label className="form-label">Course Name</label>
                <input
                  className="form-control mb-3"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />

                <label className="form-label">Description</label>
                <textarea
                  className="form-control mb-3"
                  rows="3"
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                ></textarea>

                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control mb-3"
                  value={editData.price}
                  onChange={(e) =>
                    setEditData({ ...editData, price: e.target.value })
                  }
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>

                <button className="btn btn-primary" onClick={handleEdit}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
