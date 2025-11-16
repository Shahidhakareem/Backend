import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CourseListing from "../CourseListing";
import "../../styles/home.css";

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/courses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCourse(res.data.course);
      } catch (err) {
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading)
    return <p className="text-center mt-5 text-lg font-semibold">Loading...</p>;

  if (error)
    return (
      <p className="text-center mt-5 text-red-600 font-semibold">{error}</p>
    );

  if (!course)
    return <p className="text-center mt-5 text-gray-600">Course not found</p>;

  return (
    <section style={{ backgroundColor: "white", marginTop: "100px" }}>
      <div className="container ">
        <div className="row">
          <div className="col-12 pt-5 ">
            <h1 className="mb-5">
              Buy Now & Unlock the Full Course: Lifetime Access, Expert Support,
              and a Career Boost!
            </h1>
            {/* --- Course Container --- */}
            <div className="bg-white shadow-md rounded-lg p-6">
              {/* --- Media Section (Image/Video) --- */}
              <div className="w-full mb-6">
                {course.courseVideo ? (
                  <video
                    controls
                    className="w-full rounded-lg shadow"
                    style={{ height: "600px", objectFit: "cover" }}
                  >
                    <source
                      src={`http://localhost:3001/${course.courseVideo}`}
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={
                      course.courseImage
                        ? `http://localhost:3001/${course.courseImage}`
                        : "https://via.placeholder.com/600x350?text=No+Image"
                    }
                    alt={course.name}
                    className="w-full rounded-lg shadow"
                    style={{ maxHeight: "400px", objectFit: "cover" }}
                  />
                )}
              </div>
              {/* --- Course Text Section --- */}
              <h2 className="text-3xl font-bold mt-5 mb-3">{course.name}</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {course.description}
              </p>

              <h5 className="text-xl font-semibold text-blue-600 mb-4">
                Price: ₹{course.price}
              </h5>
              {/* --- Buttons Section --- */}
              <div className="flex gap-5">
                <button
                  className="btn btn-primary px-4 py-2 me-3"
                  onClick={() => navigate(`/buy-course/${course._id}`)}

                >
                  Buy Now
                </button>

                <button
                  className="btn btn-outline-secondary px-4 py-2"
                  onClick={() => navigate("/courses")}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>

        
        </div>
      </div>
    </section>
  );
};

export default CourseDetails;
