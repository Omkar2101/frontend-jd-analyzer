// src/utils/api.ts (create this utility file)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  jobs: {
    base: `${API_BASE_URL}/jobs`,
    analyze: `${API_BASE_URL}/jobs/analyze`,
    upload: `${API_BASE_URL}/jobs/upload`,
    getById: (id: string) => `${API_BASE_URL}/jobs/${id}`,
    deleteById: (id: string) => `${API_BASE_URL}/jobs/${id}`,
    getByEmail: (email: string) => `${API_BASE_URL}/jobs/user/${email}`,
  },
  // ADD THIS FILES SECTION
  files: {
    base: `${API_BASE_URL}/api/files`,
    getFile: (storedFileName: string) => `${API_BASE_URL}/files/${storedFileName}`,
    viewFile: (storedFileName: string) => `${API_BASE_URL}/files/${storedFileName}/view`,
    downloadFile: (storedFileName: string) => `${API_BASE_URL}/files/${storedFileName}/download`,
  }
};