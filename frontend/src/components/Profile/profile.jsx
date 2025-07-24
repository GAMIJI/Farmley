import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Axios/axiosInstance";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    mobile: "123-456-7890",
    address: "123 Main St, City, Country",
    profileImage: "/uploads/default.jpg",
  });

  const [error, setError] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  const [editMode, setEditMode] = useState({
    name: false,
    mobile: false,
    address: false,
    profileImage: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      const response = await API.put("/user/profile/update", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data.user);
    } catch (err) {
      console.error("❌ Profile Fetch Error:", err);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to fetch profile. Please try again.");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("mobile", userData.mobile);
      formData.append("address", userData.address);
      if (userData.profileImage instanceof File) {
        formData.append("profileImage", userData.profileImage);
      }

      const response = await API.put("/user/profile/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Profile updated successfully!");
      setEditMode({ name: false, mobile: false, address: false, profileImage: false });
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("Failed to update profile. Try again.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, profileImage: file });
      setIsEdited(true);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const renderEditButton = (field) => (
    <button
      type="button"
      style={{
        padding: "0.25rem 0.5rem",
        fontSize: "0.875rem",
        lineHeight: "1.5",
        color: "#0d6efd",
        backgroundColor: "transparent",
        backgroundImage: "none",
        border: "1px solid #0d6efd",
        borderRadius: "0.2rem",
        position: "absolute",
        top: "50%",
        right: "10px",
        transform: "translateY(-50%)",
        cursor: "pointer",
        transition: "all 0.15s ease-in-out",
      }}
      onClick={() => setEditMode((prev) => ({ ...prev, [field]: !prev[field] }))}
    >
      {editMode[field] ? "Save" : "Edit"}
    </button>
  );

  // Styles
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      padding: "20px",
    },
    card: {
      width: "100%",
      maxWidth: "500px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      padding: "32px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
      border: "1px solid #eaeaea",
    },
    header: {
      textAlign: "center",
      marginBottom: "32px",
      color: "#333",
      fontSize: "24px",
      fontWeight: "500",
    },
    profileImageContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "24px",
    },
    profileImage: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "2px solid #f0f0f0",
    },
    editImageButton: {
      marginTop: "12px",
      padding: "6px 12px",
      backgroundColor: "transparent",
      color: "#555",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "14px",
      cursor: "pointer",
    },
    section: {
      marginBottom: "28px",
    },
    sectionTitle: {
      fontSize: "14px",
      color: "#777",
      marginBottom: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    inputField: {
      position: "relative",
      marginBottom: "20px",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "16px",
      border: "1px solid #e0e0e0",
      borderRadius: "6px",
      color: "#333",
      outline: "none",
    },
    inputFocus: {
      borderColor: "#4a90e2",
    },
    textarea: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "16px",
      border: "1px solid #e0e0e0",
      borderRadius: "6px",
      color: "#333",
      minHeight: "100px",
      resize: "vertical",
      outline: "none",
    },
    editButton: {
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      backgroundColor: "transparent",
      color: "#4a90e2",
      border: "none",
      fontSize: "14px",
      cursor: "pointer",
    },
    button: {
      width: "100%",
      padding: "14px",
      fontSize: "16px",
      fontWeight: "500",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer",
      marginTop: "8px",
    },
    submitButton: {
      backgroundColor: "#4a90e2",
      color: "white",
    },
    logoutButton: {
      backgroundColor: "transparent",
      color: "#e74c3c",
      border: "1px solid #e74c3c",
    },
    error: {
      color: "#e74c3c",
      fontSize: "14px",
      textAlign: "center",
      marginBottom: "20px",
      padding: "12px",
      backgroundColor: "#fef2f2",
      borderRadius: "6px",
    },
    fileInput: {
      width: "100%",
      marginTop: "12px",
    },
  };


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>My Profile</h2>

        {error && <div style={styles.error}>{error}</div>}

        {/* Profile Image */}
        <div style={styles.profileImageContainer}>
          <img
            src={
              userData.profileImage instanceof File
                ? URL.createObjectURL(userData.profileImage)
                : `http://localhost:5001${userData.profileImage}`
            }
            alt="Profile"
            style={styles.profileImage}
          />
          {editMode.profileImage && (
            <input
              type="file"
              accept="image/*"
              style={styles.fileInput}
              onChange={handleImageChange}
            />
          )}
          <button
            type="button"
            style={styles.editImageButton}
            onClick={() =>
              setEditMode((prev) => ({ ...prev, profileImage: !prev.profileImage }))
            }
          >
            {editMode.profileImage ? "Save" : "Change Photo"}
          </button>
        </div>

        {/* Personal Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Personal Information</h3>

          <div style={styles.inputField}>
            <input
              type="text"
              style={{ ...styles.input, ...(editMode.name && styles.inputFocus) }}
              value={userData.name}
              readOnly={!editMode.name}
              onChange={(e) => {
                setUserData({ ...userData, name: e.target.value });
                setIsEdited(true);
              }}
              placeholder="Full Name"
            />
            <button
              type="button"
              style={styles.editButton}
              onClick={() => setEditMode((prev) => ({ ...prev, name: !prev.name }))}
            >
              {editMode.name ? "Save" : "Edit"}
            </button>
          </div>

          <div style={styles.inputField}>
            <input
              type="text"
              style={styles.input}
              value={userData.email}
              readOnly
              placeholder="Email Address"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Contact Information</h3>

          <div style={styles.inputField}>
            <input
              type="text"
              style={{ ...styles.input, ...(editMode.mobile && styles.inputFocus) }}
              value={userData.mobile}
              readOnly={!editMode.mobile}
              onChange={(e) => {
                setUserData({ ...userData, mobile: e.target.value });
                setIsEdited(true);
              }}
              placeholder="Phone Number"
            />
            <button
              type="button"
              style={styles.editButton}
              onClick={() => setEditMode((prev) => ({ ...prev, mobile: !prev.mobile }))}
            >
              {editMode.mobile ? "Save" : "Edit"}
            </button>
          </div>

          <div style={styles.inputField}>
            <textarea
              style={{ ...styles.textarea, ...(editMode.address && styles.inputFocus) }}
              value={userData.address}
              readOnly={!editMode.address}
              onChange={(e) => {
                setUserData({ ...userData, address: e.target.value });
                setIsEdited(true);
              }}
              placeholder="Address"
            />
            <button
              type="button"
              style={{ ...styles.editButton, top: "25px" }}
              onClick={() => setEditMode((prev) => ({ ...prev, address: !prev.address }))}
            >
              {editMode.address ? "Save" : "Edit"}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div>
          {isEdited && (
            <button
              style={{ ...styles.button, ...styles.submitButton }}
              onClick={handleUpdate}
            >
              Save Changes
            </button>
          )}
          <button
            style={{ ...styles.button, ...styles.logoutButton }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;