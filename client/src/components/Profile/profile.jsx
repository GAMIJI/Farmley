import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEdit2, FiSave, FiX, FiLogOut, FiUser, FiMail, FiPhone, FiMapPin, FiCamera } from "react-icons/fi";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    profileImage: null,
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showAlert("Session expired. Please log in again.", "error");
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API_URL}user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserData(response.data.user);
    } catch (err) {
      console.error("Profile fetch error:", err);
      if (err.response?.status === 401) {
        showAlert("Session expired. Please log in again.", "error");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        showAlert("Failed to load profile. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ ...alert, show: false }), 5000);
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

      await axios.put(`${API_URL}user/profile/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      showAlert("Profile updated successfully", "success");
      setEditMode(false);
    } catch (err) {
      console.error("Update error:", err);
      showAlert("Failed to update profile. Please try again.", "error");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, profileImage: file });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f9fafb"
      }}>
        <div style={{
          animation: "spin 1s linear infinite",
          border: "4px solid rgba(0, 0, 0, 0.1)",
          borderLeftColor: "#3b82f6",
          borderRadius: "50%",
          width: "40px",
          height: "40px"
        }}></div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      padding: "32px 16px"
    }}>
      {/* Alert Notification */}
      {alert.show && (
        <div style={{
          position: "fixed",
          top: "16px",
          right: "16px",
          zIndex: 50,
          padding: "16px",
          borderRadius: "6px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: alert.type === "success" ? "#ecfdf5" : "#fef2f2",
          color: alert.type === "success" ? "#065f46" : "#991b1b",
          display: "flex",
          alignItems: "center",
          maxWidth: "400px",
          transition: "all 0.3s ease"
        }}>
          <div style={{ flexShrink: 0 }}>
            {alert.type === "success" ? (
              <svg style={{ width: "20px", height: "20px", color: "#10b981" }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg style={{ width: "20px", height: "20px", color: "#ef4444" }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div style={{ marginLeft: "12px" }}>
            <p style={{ fontSize: "14px", fontWeight: 500 }}>{alert.message}</p>
          </div>
          <button 
            onClick={() => setAlert({ ...alert, show: false })}
            style={{
              marginLeft: "auto",
              padding: "4px",
              borderRadius: "4px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              outline: "none"
            }}
          >
            <FiX style={{ width: "20px", height: "20px" }} />
          </button>
        </div>
      )}

      <div style={{
        maxWidth: "800px",
        margin: "0 auto"
      }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          overflow: "hidden"
        }}>
          {/* Profile Header */}
          <div style={{
            background: "linear-gradient(to right, #3b82f6, #2563eb)",
            padding: "32px 24px",
            textAlign: "center"
          }}>
            <div style={{
              position: "relative",
              margin: "0 auto",
              width: "128px",
              height: "128px",
              borderRadius: "50%",
              border: "4px solid white",
              backgroundColor: "white",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
            }}>
              {userData.profileImage ? (
                <img
                  src={
                    userData.profileImage instanceof File
                      ? URL.createObjectURL(userData.profileImage)
                      : `${API_URL.replace('/api/', '')}${userData.profileImage}`
                  }
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <div style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  backgroundColor: "#dbeafe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <FiUser style={{ color: "#3b82f6", fontSize: "48px" }} />
                </div>
              )}
              {editMode && (
                <label style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  backgroundColor: "white",
                  padding: "8px",
                  borderRadius: "50%",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer"
                }}>
                  <FiCamera style={{ color: "#3b82f6" }} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>
            <h1 style={{
              marginTop: "16px",
              fontSize: "24px",
              fontWeight: 700,
              color: "white"
            }}>{userData.name}</h1>
            <p style={{ color: "#bfdbfe" }}>{userData.email}</p>
          </div>

          {/* Profile Content */}
          <div style={{ padding: "32px 24px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px"
            }}>
              <h2 style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#1f2937"
              }}>Personal Information</h2>
              {editMode ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setEditMode(false)}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#e5e7eb",
                      color: "#374151",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    <FiX style={{ marginRight: "4px" }} /> Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    <FiSave style={{ marginRight: "4px" }} /> Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  <FiEdit2 style={{ marginRight: "4px" }} /> Edit Profile
                </button>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Name Field */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#6b7280",
                  marginBottom: "4px"
                }}>Full Name</label>
                {editMode ? (
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      outline: "none",
                      fontSize: "16px"
                    }}
                  />
                ) : (
                  <div style={{
                    padding: "8px 12px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "6px",
                    fontSize: "16px"
                  }}>{userData.name}</div>
                )}
              </div>

              {/* Email Field (readonly) */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#6b7280",
                  marginBottom: "4px"
                }}>Email</label>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 12px",
                  backgroundColor: "#f9fafb",
                  borderRadius: "6px"
                }}>
                  <FiMail style={{ color: "#9ca3af", marginRight: "8px" }} />
                  <span>{userData.email}</span>
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#6b7280",
                  marginBottom: "4px"
                }}>Phone Number</label>
                {editMode ? (
                  <input
                    type="text"
                    value={userData.mobile}
                    onChange={(e) => setUserData({ ...userData, mobile: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      outline: "none",
                      fontSize: "16px"
                    }}
                  />
                ) : (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 12px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "6px",
                    fontSize: "16px"
                  }}>
                    <FiPhone style={{ color: "#9ca3af", marginRight: "8px" }} />
                    <span>{userData.mobile || "Not provided"}</span>
                  </div>
                )}
              </div>

              {/* Address Field */}
              <div>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#6b7280",
                  marginBottom: "4px"
                }}>Address</label>
                {editMode ? (
                  <textarea
                    value={userData.address}
                    onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                    rows="3"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      outline: "none",
                      fontSize: "16px",
                      resize: "vertical"
                    }}
                  />
                ) : (
                  <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    padding: "8px 12px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "6px",
                    fontSize: "16px"
                  }}>
                    <FiMapPin style={{ color: "#9ca3af", marginRight: "8px", marginTop: "2px" }} />
                    <span>{userData.address || "Not provided"}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <div style={{
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid #e5e7eb"
            }}>
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "8px 16px",
                  border: "1px solid transparent",
                  fontSize: "14px",
                  fontWeight: 500,
                  borderRadius: "6px",
                  color: "#dc2626",
                  backgroundColor: "#fee2e2",
                  cursor: "pointer"
                }}
              >
                <FiLogOut style={{ marginRight: "8px" }} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Profile;