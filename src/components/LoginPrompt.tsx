import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="modal-overlay">
      <div className="modal-content">
        <h4 style={{ marginBottom: '20px', color: 'var(--primary-color)' }}>Please Login First</h4>
        <p style={{ marginBottom: '20px', color: 'var(--secondary-color)' }}>
          You need to be logged in to analyze job descriptions.
        </p>
        <button 
          className="btn btn-primary" 
          onClick={handleLogin}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default LoginPrompt;