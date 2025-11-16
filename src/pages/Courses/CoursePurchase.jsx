import React, { useEffect, useState } from "react";
import "../../styles/purchase.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import urls from "../../services/urls";
import { jwtDecode } from "jwt-decode";

export default function CoursePurchase() {
  const { courseId } = useParams();

  const [email, setEmail] = useState("");
  const [courseName, setCourseName] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [loading, setLoading] = useState(true);
  

  const navigate = useNavigate();

  // 🔥 Fetch course details + user email from token
useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        const decoded = jwtDecode(token);
        setEmail(decoded.email || "");
      }

      // FIX ✔ added token to headers
      const res = await axios.get(
        `${urls.baseURL.dev}${urls.courseList}/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCourseName(res.data.course.name);
      setCoursePrice(res.data.course.price);

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (courseId) fetchData(); // prevent API call with undefined
}, [courseId]);


  // ⭐ RAZORPAY PAYMENT FUNCTION
  const startRazorpayPayment = () => {
    if (!email) {
      alert("Please enter your email before continuing");
      return;
    }

    const options = {
      key: "rzp_test_1234567890", // replace with your test key
      amount: coursePrice * 100,
      currency: "INR",
      name: "WebWorld Courses",
      description: `Purchase of ${courseName}`,
      handler: function (response) {
        alert(
          "Payment Successful! Payment ID: " + response.razorpay_payment_id
        );
      },
      prefill: {
        email: email,
        name: "Student User",
      },
      theme: {
        color: "#0d6efd",
      },
    };

    const razorpayObject = new window.Razorpay(options);
    razorpayObject.open();
  };

  if (loading) return <h2 className="text-center mt-5">Loading...</h2>;

  return (
    <div className="container-fluid bg-light py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 bg-white shadow rounded p-0 d-flex flex-column flex-lg-row">
          
          {/* LEFT SECTION */}
          <div className="col-lg-6 p-5 border-end">
            <span className="badge bg-warning text-dark">TEST MODE</span>

            <h3 className="mt-4 fw-semibold">{courseName}</h3>

            <h1 className="fw-bold mt-3">₹{coursePrice}</h1>

            <hr className="my-4" />

            <p className="text-muted">
              Lifetime access, certificate of completion, downloadable
              resources, and all future updates.
            </p>
          </div>

          {/* RIGHT SECTION */}
          <div className="col-lg-6 p-5">
            <button
              className="btn btn-outline-secondary px-4 py-2"
              onClick={() => navigate("/courses")}
            >
              Go Back
            </button>

            <button className="btn btn-success w-100 mt-4 py-2 fw-semibold">
              Pay with Link
            </button>

            <div className="d-flex align-items-center my-4">
              <div className="flex-grow-1 border-top"></div>
              <span className="mx-3 text-muted">OR</span>
              <div className="flex-grow-1 border-top"></div>
            </div>

            {/* EMAIL INPUT */}
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control mb-3"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* PAYMENT BLOCK */}
            <label className="form-label">Payment method</label>

            <div className="border rounded p-3 mb-3">
              <div className="input-icon mb-2">
                <input
                  className="form-control"
                  placeholder="1234 1234 1234 1234"
                />
                <i className="fa-brands fa-cc-visa" style={{ color: "#0c43a1" }}></i>
              </div>

              <div className="row">
                <div className="col">
                  <input className="form-control" placeholder="MM / YY" />
                </div>
                <div className="col">
                  <input className="form-control" placeholder="CVC" />
                </div>
              </div>
            </div>

            <label className="form-label">Cardholder name</label>
            <input className="form-control mb-3" placeholder="Full name on card" />

            <label className="form-label">Country or region</label>
            <select className="form-select mb-4">
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
            </select>

            <div className="form-check mb-4">
              <input className="form-check-input" type="checkbox" id="saveInfo" />
              <label className="form-check-label text-muted">
                Save my information for faster checkout
              </label>
            </div>

            <button
              className="btn btn-primary w-100 py-2 fw-semibold"
              onClick={startRazorpayPayment}
            >
              Pay ₹{coursePrice}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
