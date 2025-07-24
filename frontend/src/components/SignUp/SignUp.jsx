import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link } from "react-router-dom";
import API from "../../Axios/axiosInstance";
import "./SignUp.css";

const SignUp = () => {
  const initialState = {
    name: "",
    email: "",
    number: "",
    password: "",
    password2: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const imageRef = useRef(null); // 🔥 Ref to access file directly

  const onChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage" && files.length > 0) {
      const file = files[0];

      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      return setErrors({ password2: "Passwords must match" });
    }

    try {
      const newUser = new FormData();
      newUser.append("name", formData.name);
      newUser.append("email", formData.email);
      newUser.append("mobile", formData.mobile);
      newUser.append("password", formData.password);
      newUser.append("password2", formData.password2);

      // if (imageRef.current?.files[0]) {
      //   newUser.append("profileImage", imageRef.current.files[0]); // ✅ Use file ref
      // }

      // Debug log
      for (let pair of newUser.entries()) {
        console.log(pair[0], pair[1]);
      }

      await API.post("/user/signup", {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        password2: formData.password2,
      });       

      setFormData(initialState);
      setPreviewImage(null);
      navigate("/Login");
    } catch (error) {
      console.error("Signup Error:", error);
      setErrors(error.response?.data || { general: "Signup failed" });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center  mt-3 mb-3">
      <div className="card p-4 shadow-lg text-center" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="fw-bold">Sign Up</h3>

        {/* <div className="profile-img-container mt-2 mb-3 d-flex flex-column align-items-center">
          <label htmlFor="profileImageUpload">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="rounded-circle border border-3 border-primary"
                style={{ width: "70px", height: "70px", objectFit: "cover", cursor: "pointer" }}
              />
            ) : (
              <FontAwesomeIcon icon={faUserCircle} className="text-secondary" size="3x" />
            )}
          </label>
          <input
            type="file"
            id="profileImageUpload"
            name="profileImage"
            accept="image/*"
            onChange={onChange}
            ref={imageRef} // ✅ Connected ref
            hidden
          />
          <button
            className="btn btn-outline-primary btn-sm mt-3"
            onClick={() => document.getElementById("profileImageUpload").click()}
          >
            Choose Profile
          </button>
        </div> */}

        <form className="form" onSubmit={onSubmit} noValidate>
          {/* user name */}
           <input type="text" name="name" className="form-control mb-2" placeholder="Full Name" value={formData.name} onChange={onChange} required />
          {errors.name && <div className="text-danger mb-2">{errors.name}</div>}
           {/* gmail */}
          <input type="email" name="email" className="form-control mb-2" placeholder="Email" value={formData.email} onChange={onChange} required />
          {errors.email && <div className="text-danger mb-2">{errors.email}</div>}

         {/* mobile */}
          <div className="input-group mb-2">
            <input
              type="tel" // better suited than "number" for phone numbers
              name="mobile" // avoid spaces in name attributes
              className="form-control"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={onChange}
              pattern="[0-9]{10}" // optional: restrict to 10 digits
              maxLength="10" // optional: prevent typing more than 10
              required
            />
          </div>

          {errors.password && <div className="text-danger mb-2">{errors.password}</div>}

          <div className="input-group mb-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="form-control"
              placeholder="Password"
              value={formData.password}
              onChange={onChange}
              required
            />
            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          {errors.password && <div className="text-danger mb-2">{errors.password}</div>}



          <div className="input-group mb-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="password2"
              className="form-control"
              placeholder="Confirm Password"
              value={formData.password2}
              onChange={onChange}
              required
            />
            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          {errors.password2 && <div className="text-danger mb-2">{errors.password2}</div>}

          {errors.general && <div className="text-danger mb-2">{errors.general}</div>}

          <button type="submit" className="btn btn-primary w-100 mt-2">Sign Up</button>

          <div className="mt-3">
            <Link to="/Login" className="text-decoration-none">Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
