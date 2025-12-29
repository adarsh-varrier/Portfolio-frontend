// Frontend/src/config/api.js
// API base URL - uses environment variable in production, localhost in development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    ME: `${API_BASE_URL}/api/auth/me`,
  },
  WORK_EXPERIENCE: `${API_BASE_URL}/api/work-experience`,
  CERTIFICATES: `${API_BASE_URL}/api/certificates`,
  EDUCATION: `${API_BASE_URL}/api/education`,
  OUT_OF_THE_BOX: `${API_BASE_URL}/api/outofthebox`,
  PROJECTS: `${API_BASE_URL}/api/projects`,
  OTHER_DETAILS: `${API_BASE_URL}/api/other-details`,
};

export default API_BASE_URL;

