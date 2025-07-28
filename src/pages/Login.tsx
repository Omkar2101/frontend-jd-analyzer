import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { StorageService } from "../utils/storage";
import "../styles/Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Use StorageService to save user email and check if it was successful
      const success = StorageService.setUserEmail(email);

      if (!success) {
        throw new Error("Failed to save user email");
      }

      toast.success("User logged in successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch  {
      setError( "Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing a valid email
    if (
      error &&
      e.target.value.trim() &&
      /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.target.value.trim())
    ) {
      setError("");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="login-card card shadow-lg border-0 mt-5">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="login-title text-primary fw-bold">
                  Welcome Back!
                </h2>
                <p className="text-muted">Please sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit} role="form">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    className={`form-control form-control-lg ${
                      error ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                  {error && (
                    <div
                      data-testid="my-div"
                      className="invalid-feedback d-block"
                    >
                      Please enter a valid email address
                    </div>
                  )}
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
