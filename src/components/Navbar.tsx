import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <span
        className="navbar-brand mb-0 h1"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        JD Analyzer
      </span>

      <div className="ms-auto d-flex align-items-center">
        <button
          className="btn btn-light me-3"
          onClick={() => navigate("/jds")}
        >
          View All JDs
        </button>
        
        {userEmail ? (
          <div className="d-flex align-items-center" style={{ color: 'white' }}>
            <div className="me-2" style={{ 
              width: '35px', 
              height: '35px', 
              borderRadius: '50%', 
              background: '#fff', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--primary-color)',
              fontWeight: 'bold'
            }}>
              {userEmail[0].toUpperCase()}
            </div>
            <span className="me-3">User</span>
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="btn btn-light"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
