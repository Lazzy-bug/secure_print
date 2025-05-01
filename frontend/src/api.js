import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
});
const token = localStorage.getItem("token");

const response = await fetch("http://localhost:5000/api/owner/owner-dashboard", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
