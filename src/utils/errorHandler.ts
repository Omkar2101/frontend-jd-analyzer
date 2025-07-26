// utils/errorHandler.ts
import { toast } from 'react-toastify';

export interface ApiErrorResponse {
  error: boolean;
  message: string;
  type: string;
  status_code: number;
  timestamp?: string;
}

export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  let errorMessage = 'An unexpected error occurred. Please try again.';
  let toastType: 'error' | 'warning' | 'info' = 'error';
  
  // Handle network errors first
  if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
    errorMessage = 'Network error. Please check your connection and try again.';
    toastType = 'warning';
    toast.warning(errorMessage);
    return { errorMessage, toastType };
  }
  
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    errorMessage = 'Request timed out. Please try again.';
    toastType = 'warning';
    toast.warning(errorMessage);
    return { errorMessage, toastType };
  }
  
  // Handle HTTP response errors
  if (error.response?.data) {
    const errorData = error.response.data;
    
    // Handle structured error responses from our API
    if (typeof errorData === 'object' && errorData.error === true) {
      const apiError = errorData as ApiErrorResponse;
      errorMessage = apiError.message || errorMessage;
      
      switch (apiError.type) {
        case 'validation_error':
          toastType = 'error';
          errorMessage = apiError.message || 'Please check your input and try again.';
          break;
          
        case 'ai_service_error':
          toastType = 'warning';
          errorMessage = apiError.message || 'AI service is experiencing issues. Please try rephrasing your job description or try again in a few moments.';
          break;
          
        case 'service_unavailable':
          toastType = 'warning';
          errorMessage = apiError.message || 'Service is temporarily busy. Please wait a moment and try again.';
          break;
          
        case 'timeout_error':
          toastType = 'warning';
          errorMessage = apiError.message || 'The request timed out. Please try again with a shorter job description.';
          break;
          
        case 'rate_limit_exceeded':
          toastType = 'warning';
          errorMessage = apiError.message || 'Too many requests. Please wait a moment before trying again.';
          break;
          
        case 'not_found':
          toastType = 'error';
          errorMessage = apiError.message || 'The requested resource was not found.';
          break;
          
        case 'internal_server_error':
        default:
          toastType = 'error';
          errorMessage = apiError.message || 'An internal server error occurred. Please try again.';
          break;
      }
    } 
    // Handle legacy string error responses
    else if (typeof errorData === 'string') {
      errorMessage = errorData;
    }
    // Handle other object types that might have a message property
    else if (typeof errorData === 'object' && errorData.message) {
      errorMessage = errorData.message;
    }
  }
  
  // Handle HTTP status codes when no structured error data is available
  if (error.response?.status && !error.response?.data?.error) {
    switch (error.response.status) {
      case 400:
        errorMessage = 'Invalid request. Please check your input.';
        toastType = 'error';
        break;
      case 401:
        errorMessage = 'Authentication required. Please log in.';
        toastType = 'error';
        break;
      case 403:
        errorMessage = 'Access denied. You don\'t have permission to perform this action.';
        toastType = 'error';
        break;
      case 404:
        errorMessage = 'The requested resource was not found.';
        toastType = 'error';
        break;
      case 429:
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
        toastType = 'warning';
        break;
      case 500:
        errorMessage = 'Internal server error. Please try again later.';
        toastType = 'error';
        break;
      case 502:
      case 503:
        errorMessage = 'Service temporarily unavailable. Please try again in a few moments.';
        toastType = 'warning';
        break;
      case 504:
        errorMessage = 'Request timed out. Please try again.';
        toastType = 'warning';
        break;
      default:
        errorMessage = `Server error (${error.response.status}). Please try again.`;
        toastType = 'error';
    }
  }
  
  // Show appropriate toast
  switch (toastType) {
    case 'warning':
      toast.warning(errorMessage, {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      break;
  
    default:
      toast.error(errorMessage, {
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
  }
  
  return { errorMessage, toastType };
};