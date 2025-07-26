import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL

// Create an Axios instance
const API = axios.create({
  baseURL: "https://farmley-backend-1.onrender.com/api/" // Base URL for your backend API
});

// Add a request interceptor to include token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = token; // Add token to Authorization header
  }
  return req;
});

export default API;
