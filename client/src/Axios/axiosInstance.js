import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL

// Create an Axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
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
