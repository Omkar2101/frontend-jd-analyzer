// src/utils/api.ts (create this utility file)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  jobs: {
    base: `${API_BASE_URL}/jobs`,
    analyze: `${API_BASE_URL}/jobs/analyze`,
    upload: `${API_BASE_URL}/jobs/upload`,
    getById: (id: string) => `${API_BASE_URL}/jobs/${id}`,
    deleteById: (id: string) => `${API_BASE_URL}/jobs/${id}`,
  }
};