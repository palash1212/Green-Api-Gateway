// import axios from "axios";

// const axiosPublic = axios.create({
//     baseURL: 'http://localhost:5000/',
// })

// const useAxiosPublic = () => {
//     return axiosPublic;
// };

// export default useAxiosPublic;

import axios from "axios";

// Debug mode
const DEBUG = true;

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 15000, // Increased timeout
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Request interceptor
axiosPublic.interceptors.request.use(
  (config) => {
    if (DEBUG) {
      console.log(`🔵 [AXIOS REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      console.log('📤 Request Data:', config.data);
    }
    return config;
  },
  (error) => {
    if (DEBUG) {
      console.error('🔴 [AXIOS REQUEST ERROR]', error.message);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
axiosPublic.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.log(`🟢 [AXIOS RESPONSE] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
      console.log('📥 Response Data:', response.data);
    }
    return response;
  },
  (error) => {
    if (DEBUG) {
      console.group('🔴 [AXIOS RESPONSE ERROR]');
      console.error('Error:', error.message);
      console.error('Code:', error.code);
      console.error('URL:', error.config?.baseURL + error.config?.url);
      console.error('Method:', error.config?.method?.toUpperCase());
      console.error('Status:', error.response?.status);
      console.groupEnd();
    }
    
    // User-friendly error messages
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.error(`
      ⚠️  CONNECTION ERROR DETECTED!
      ==============================
      Problem: Cannot connect to backend server
      
      Please check:
      1. Is the backend server running? 
         → Run: cd gag-server && node index.js
      
      2. Is it on the correct port (5000)?
         → Test: http://localhost:5000/
      
      3. Check terminal for errors
      
      4. Try restarting both servers
      `);
      
      // Show alert only in development
      if (import.meta.env.DEV) {
        alert(`
⚠️ Connection Error!
===================
Cannot connect to backend server.

Please make sure:
1. Backend is running on port 5000
2. Run: cd gag-server && node index.js
3. Then refresh this page
        `);
      }
    }
    
    return Promise.reject(error);
  }
);

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;