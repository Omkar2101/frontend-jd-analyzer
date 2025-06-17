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
    <div 
      onClick={onClose}
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div 
        className="modal-content bg-white"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '90%',
          maxWidth: '400px',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="m-0" style={{ fontSize: '1.25rem', color: '#333' }}>Login Required</h4>
          <button 
            type="button" 
            className="btn-close" 
            onClick={onClose}
            aria-label="Close"
          />
        </div>
        <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
          You need to be logged in to analyze job descriptions.
        </p>
        <div className="d-flex justify-content-end gap-2">
          <button 
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleLogin}
            
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;

// Add this CSS to your global styles
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(styleSheet);