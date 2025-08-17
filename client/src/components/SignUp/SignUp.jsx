import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const SignUp = () => {
  const [formData, setFormData] = useState({ 
    name: "",
    email: "",
    mobile: "",
    password: "",
    password2: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (formData.password !== formData.password2) {
      setIsLoading(false);
      return setErrors({ password2: "Passwords must match" });
    }

    try {
      await axios.post(`${API_URL}user/signup`, {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        password2: formData.password2,
      });

      navigate("/Login");
    } catch (error) {
      console.error("Signup Error:", error);
      setErrors(error.response?.data || { general: "Signup failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 16px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '36px'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" fill="white"/>
              <path d="M16 15C16 14.4696 15.7893 13.9609 15.4142 13.5858C15.0391 13.2107 14.5304 13 14 13H10C9.46957 13 8.96086 13.2107 8.58579 13.5858C8.21071 13.9609 8 14.4696 8 15V21H16V15Z" fill="white"/>
            </svg>
          </div>
          <h2 style={{
            margin: '0',
            color: '#2d3748',
            fontSize: '24px',
            fontWeight: '600'
          }}>Create Account</h2>
          <p style={{
            margin: '8px 0 0',
            color: '#718096',
            fontSize: '14px'
          }}>Fill in your details to get started</p>
        </div>

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#4a5568',
              fontSize: '14px',
              fontWeight: '500'
            }}>Full Name</label>
            <input
              type="text"
              name="name"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${errors.name ? '#e53e3e' : '#e2e8f0'}`,
                fontSize: '14px',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              placeholder="Enter your full name"
              value={formData.name}
              onChange={onChange}
              required
            />
            {errors.name && (
              <div style={{
                marginTop: '6px',
                color: '#e53e3e',
                fontSize: '12px'
              }}>{errors.name}</div>
            )}
          </div>

          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#4a5568',
              fontSize: '14px',
              fontWeight: '500'
            }}>Email</label>
            <input
              type="email"
              name="email"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${errors.email ? '#e53e3e' : '#e2e8f0'}`,
                fontSize: '14px',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              placeholder="Enter your email"
              value={formData.email}
              onChange={onChange}
              required
            />
            {errors.email && (
              <div style={{
                marginTop: '6px',
                color: '#e53e3e',
                fontSize: '12px'
              }}>{errors.email}</div>
            )}
          </div>

          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#4a5568',
              fontSize: '14px',
              fontWeight: '500'
            }}>Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${errors.mobile ? '#e53e3e' : '#e2e8f0'}`,
                fontSize: '14px',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChange={onChange}
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />
            {errors.mobile && (
              <div style={{
                marginTop: '6px',
                color: '#e53e3e',
                fontSize: '12px'
              }}>{errors.mobile}</div>
            )}
          </div>

          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#4a5568',
              fontSize: '14px',
              fontWeight: '500'
            }}>Password</label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.password ? '#e53e3e' : '#e2e8f0'}`,
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  outline: 'none',
                  paddingRight: '40px'
                }}
                placeholder="Create a password"
                value={formData.password}
                onChange={onChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#718096'
                }}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && (
              <div style={{
                marginTop: '6px',
                color: '#e53e3e',
                fontSize: '12px'
              }}>{errors.password}</div>
            )}
          </div>

          <div style={{ marginBottom: '24px', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              color: '#4a5568',
              fontSize: '14px',
              fontWeight: '500'
            }}>Confirm Password</label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="password2"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.password2 ? '#e53e3e' : '#e2e8f0'}`,
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  outline: 'none',
                  paddingRight: '40px'
                }}
                placeholder="Confirm your password"
                value={formData.password2}
                onChange={onChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#718096'
                }}
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password2 && (
              <div style={{
                marginTop: '6px',
                color: '#e53e3e',
                fontSize: '12px'
              }}>{errors.password2}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '16px',
              opacity: isLoading ? '0.7' : '1'
            }}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>

          {errors.general && (
            <div style={{
              padding: '12px',
              background: '#fff5f5',
              color: '#e53e3e',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              {errors.general}
            </div>
          )}

          <p style={{
            color: '#718096',
            fontSize: '14px',
            margin: '0'
          }}>
            Already have an account?{' '}
            <Link to="/Login" style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '500'
            }}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;