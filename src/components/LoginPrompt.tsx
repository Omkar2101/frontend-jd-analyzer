

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/loginPrompt.css';

interface LoginPromptProps {
  onClose: () => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  

  return (
    <div 
      onClick={onClose}
      className="login-prompt-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-prompt-title"
      
    >
      <div 
        className="login-prompt-content bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="login-prompt-header d-flex justify-content-between align-items-center mb-3">
          <h4 id="login-prompt-title" className="login-prompt-title m-0">
            Login Required
          </h4>
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose}
            aria-label="Close"
          />
        </div>
        
        <p className="login-prompt-message text-muted mb-4">
          You need to be logged in to analyze job descriptions.
        </p>
        
        <div className="login-prompt-actions d-flex justify-content-end gap-2">
          <button 
            className="btn btn-secondary"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleLogin}
            type="button"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;