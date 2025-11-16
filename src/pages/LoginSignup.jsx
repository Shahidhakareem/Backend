import React, { useState } from "react";
import axios from "axios";
import "../styles/login.css";
import minlogo from "../images/login-logo.png";
import { useNavigate } from "react-router-dom";
import urls from "../services/urls";

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false); // toggle form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!role) {
      setError("Please select a role (Student, Instructor, or Admin).");
      return;
    }

    setLoading(true);

    try {
      const base =
        process.env.NODE_ENV === "production"
          ? urls.baseURL.prod
          : urls.baseURL.dev;
      const endpoint = isSignup ? urls.signUp : urls.login;
      const url = `${base}${endpoint}`;

      const payload = isSignup
        ? { email, password, role, name }
        : { email, password };

      const response = await axios.post(url, payload);

      if (response.status === 200) {
        if (isSignup) {
          setSuccess("Signup successful! Redirecting to login...");
          setTimeout(() => {
            navigate("/"); // Redirect to login page
          }, 1000);
        } else {
          // Login success → navigate to home/dashboard
          setSuccess("Login successful!");
          localStorage.setItem("token", response.data.token);
          navigate("/courses"); // Home page or dashboard
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Invalid credentials or server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="container py-4">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-10 col-md-12">
            <div className="row g-0 auth-wrapper">
              {/* Left Intro */}
              <div className="col-md-6 intro-section text-center">
                <img src={minlogo} alt="Logo" style={{cursor:"pointer"}}  onClick={()=>{
                  navigate("/");
                }}/>
                <h2>{isSignup ? "Welcome!" : "Hello, Friends!"}</h2>
                <p className="mt-3">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>

              {/* Right Form */}
              <div className="col-md-6 form-section">
                <form onSubmit={handleSubmit}>
                  <h2>{isSignup ? "Sign Up" : "Log In"}</h2>
                  <p>
                    {isSignup
                      ? "Already have an account?"
                      : "Don’t have an account?"}{" "}
                    <button
                      type="button"
                      className="btn btn-link p-2 ms-2"
                      onClick={() => setIsSignup(!isSignup)}
                    >
                      {isSignup ? "Log In" : "Sign Up"}
                    </button>
                  </p>

                  {/* Role buttons */}
                  <div className="mb-3">
                    {["student", "instructor", "admin"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        className={`btn mx-2 ${
                          role === r ? "btn-primary" : "btn-outline-primary"
                        }`}
                        onClick={() => setRole(r)}
                      >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Inputs */}
                  {isSignup && (
                    <input
                      type="text"
                      className="email-pass mb-3"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  )}
                  <input
                    type="email"
                    className="email-pass mb-3"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autocomplete="off"
                  />
                  <input
                    type="password"
                    className="email-pass mb-3"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                   autocomplete="new-password"
                  />

                  <button
                    type="submit"
                    className="login-button"
                    disabled={loading}
                  >
                    {loading
                      ? isSignup
                        ? "Signing up..."
                        : "Logging in..."
                      : isSignup
                      ? "Sign Up"
                      : "Log In"}
                  </button>

                  {error && (
                    <p className="text-danger mt-3 text-center">{error}</p>
                  )}
                  {success && (
                    <p className="text-success mt-3 text-center">{success}</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
