
import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "../hooks/useNavigation";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
  const { userEmail, isLoading, logout } = useAuth();
  const { navigateToRoute } = useNavigation();

  const handleLogout = () => {
    const success = logout();
    if (success) {
      navigateToRoute("/");
    } else {
      console.error("Logout failed");
      // Optionally show user feedback
    }
  };

  const handleNavigation = (route: string) => {
    navigateToRoute(route);
  };

  if (isLoading) {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
        <span className="navbar-brand mb-0 h1">JD Analyzer</span>
        <div className="ms-auto">
          <div className="loading-spinner"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <span
        className="navbar-brand navbar-brand-clickable mb-0 h1"
        onClick={() => handleNavigation("/")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleNavigation("/");
          }
        }}
      >
        JD Analyzer
      </span>

      <div className="ms-auto d-flex align-items-center">
        {userEmail ? (
          <>
            <button
              className="btn btn-light me-3"
              onClick={() => handleNavigation("/jds")}
              type="button"
            >
              View All JDs
            </button>
            <div className="user-info d-flex align-items-center">
              <div className="user-avatar me-2">
                {userEmail[0].toUpperCase()}
              </div>
              <span className="user-label me-3">User</span>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
                type="button"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <button 
            className="btn btn-light" 
            onClick={() => handleNavigation("/login")}
            type="button"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;