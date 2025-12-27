import axios from "axios";

const API_URL = "http://localhost:3001/api"; // Ton backend

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor pour ajouter le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // on stockera le JWT dans localStorage
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
