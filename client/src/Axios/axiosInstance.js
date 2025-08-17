import axios from "axios";
const API_URL = process.env.REACT_APP_API_BASE_URL;
console.log("api instant", API_URL);

const API = axios.create({
  baseURL: `${API_URL}`,
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
