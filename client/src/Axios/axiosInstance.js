import axios from "axios";

const API = axios.create({
  baseURL: "https://farmley-backend-1.onrender.com/api", // your backend URL
  withCredentials: true, // send cookies or auth headers
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
