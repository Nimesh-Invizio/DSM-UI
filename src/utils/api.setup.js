// api.setup.js
import axios from 'axios';

// Default configuration
const defaultConfig = {
  baseURL: process.env.REACT_APP_API_BASE_URL, // Set the base URL from environment variable
  timeout: 60000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function to retrieve the authentication token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Request interceptor for adding headers or other configurations
const requestInterceptor = (config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// Response interceptor for handling responses
const responseInterceptor = (response) => {
  return response;
};

// Error interceptor for handling errors
const errorInterceptor = (error) => {
  if (error.response) {
    // Server responded with a status code outside the 2xx range
    console.error('API Error:', error.response.data);
    console.error('Status:', error.response.status);

    // You can handle different error status codes here
    if (error.response.status === 401) {
      // Unauthorized, handle token expiration or logout
      // ...
    } else if (error.response.status === 403) {
      // Forbidden, handle insufficient permissions
      // ...
    } else if (error.response.status === 404) {
      // Not found, handle missing resources
      // ...
    }
  } else if (error.request) {
    // The request was made, but no response was received
    console.error('No response received from API:', error.request);
  } else {
    // Something happened in setting up the request that triggered an error
    console.error('Request error:', error.message);
  }

  return Promise.reject(error);
};

// Create an Axios instance with default configuration
const api = axios.create(defaultConfig);

// Add request and response interceptors to the default instance
api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use(responseInterceptor, errorInterceptor);

// Create a function to generate a custom API instance
const createAPIInstance = (config) => {
  const customInstance = axios.create({ ...defaultConfig, ...config });

  // Add request and response interceptors to the custom instance
  customInstance.interceptors.request.use(requestInterceptor);
  customInstance.interceptors.response.use(responseInterceptor, errorInterceptor);

  return customInstance;
};

// Export the default API instance and the createAPIInstance function
export { api, createAPIInstance };