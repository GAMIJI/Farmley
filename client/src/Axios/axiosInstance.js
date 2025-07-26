import axios from "axios";

const API = axios.create({
  baseURL: "https://farmley-backend-1.onrender.com/api",
  withCredentials: true, // ✅ important for CORS cookies
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
