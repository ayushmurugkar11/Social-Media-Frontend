import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://social-media-backend-jf73.onrender.com/api',
  withCredentials: true, // for cookies/auth sessions if needed
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;