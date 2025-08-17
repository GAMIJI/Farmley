import React, { useState } from 'react';
import API from '../../Axios/axiosInstance';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_BASE_URL;
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    try {
      const response = await axios.post(`${API_URL}user/login`, formData);
      
      localStorage.setItem('userData', response?.data.user._id)
      if (response.data.success === true ) {
        
        localStorage.setItem('token', response.data.token); // Save token to localStorage
        navigate('/'); // Navigate to a protected route
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data); // Set backend validation errors
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div className="row w-100">
      <div className="col-md-6 col-lg-4 mx-auto">
        <div
          className="card shadow-lg p-4"
          style={{
            borderRadius: "15px",
            border: "none",
          }}
        >
          <div className="text-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="User Icon"
              width="80"
              className="mb-3"
            />
            <h3 className="fw-bold">Welcome Back</h3>
            <small className="text-muted">Login to your account</small>
          </div>
          <form className="signup mt-3" onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <input
                type="text"
                name="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>
            <div className="form-group mb-3">
              <input
                type="password"
                name="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>
        
            <button
              type="submit"
              className="btn btn-primary w-100 fw-bold shadow-sm"
            >
              Login
            </button>
            {errors.general && <p className="text-danger">{errors.general}</p>}
            <div className="row mt-3">
              <div className="col-6 text-start">
                <a href="#" className="text-decoration-none text-primary">
                  Forgot password?
                </a>
              </div>
              <div className="col-6 text-end">
                <Link to="/SignUp" className="text-decoration-none text-primary">
                  Sign Up Now
                </Link>
              </div>
            </div>
          </form>
        </div>
      
      </div>
    </div>
  </div>
  );
};

export default Login;
