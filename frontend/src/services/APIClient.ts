import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/",
  params: { api_key: "api_key_123" },
});

// Gắn token động trước mỗi request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
