import axios from 'axios';

// Vercel automatically sets the domain, so in production, 
// we want a relative path. In development, we use localhost.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '', 
  withCredentials: true,
});

export default API;