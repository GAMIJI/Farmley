import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}user/login`, formData);
      
      localStorage.setItem('userData', response?.data.user._id);
      if (response.data.success === true) {
        localStorage.setItem('token', response.data.token);
        navigate('/');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
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
            justifyContent: 'center'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" fill="white"/>
              <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="white"/>
            </svg>
          </div>
          <h2 style={{
            margin: '0',
            color: '#2d3748',
            fontSize: '24px',
            fontWeight: '600'
          }}>Welcome back</h2>
          <p style={{
            margin: '8px 0 0',
            color: '#718096',
            fontSize: '14px'
          }}>Sign in to continue to your account</p>
        </div>

        <form onSubmit={handleLogin}>
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
              onChange={handleInputChange}
            />
            {errors.email && (
              <div style={{
                marginTop: '6px',
                color: '#e53e3e',
                fontSize: '12px'
              }}>{errors.email}</div>
            )}
          </div>

          <div style={{ marginBottom: '24px', textAlign: 'left' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <label style={{
                color: '#4a5568',
                fontSize: '14px',
                fontWeight: '500'
              }}>Password</label>
              <Link to="/forgot-password" style={{
                color: '#667eea',
                fontSize: '13px',
                textDecoration: 'none',
                fontWeight: '500'
              }}>Forgot password?</Link>
            </div>
            <input
              type="password"
              name="password"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: `1px solid ${errors.password ? '#e53e3e' : '#e2e8f0'}`,
                fontSize: '14px',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && (
              <div style={{
                marginTop: '6px',
                color: '#e53e3e',
                fontSize: '12px'
              }}>{errors.password}</div>
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
            {isLoading ? 'Signing in...' : 'Sign In'}
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
            Don't have an account?{' '}
            <Link to="/SignUp" style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '500'
            }}>Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;