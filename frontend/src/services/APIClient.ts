import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/",
  params: { api_key: "api_key_123" },
  withCredentials: true,
});

export default API;
