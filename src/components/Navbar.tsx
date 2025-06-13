import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <span
        className="navbar-brand mb-0 h1"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        JD Analyzer
      </span>

      <div className="ms-auto">
        
        <button
          className="btn btn-light"
          onClick={() => navigate("/jds")}
        >
          View All JDs
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
