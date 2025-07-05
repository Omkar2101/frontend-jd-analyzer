import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { RootState } from '../store/store';
import '../styles/analysis.css';

const Analysis: React.FC = () => {
  const navigate = useNavigate();
  const result = useSelector((state: RootState) => state.result.data);

  useEffect(() => {
    if (!result) {
      navigate('/');
    }
  }, [result, navigate]);

  if (!result) {
    return (
      <div className="container mt-5 text-center">
        <h3>No analysis data available</h3>
        <Link to="/" className="btn btn-primary mt-3">Analyze New Job Description</Link>
      </div>
    );
  }
  const handleDownload = () => {
    navigate('/download');
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'danger';
  };


  return (
    <div className="container py-4" id="analysis-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Job Description Analysis</h2>
        <Link to="/" className="btn btn-outline-primary">Analyze New JD</Link>
      </div>

      {/* Score Overview */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className={`card border-${getScoreColor(result.bias_score)} h-100`}>
            <div className="card-body text-center">
              <h5 className="card-title">Bias Score</h5>
              <h2 className={`text-${getScoreColor(result.bias_score)}`}>
                {(result.bias_score * 100).toFixed(1)}%
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className={`card border-${getScoreColor(result.inclusivity_score)} h-100`}>
            <div className="card-body text-center">
              <h5 className="card-title">Inclusivity Score</h5>
              <h2 className={`text-${getScoreColor(result.inclusivity_score)}`}>
                {(result.inclusivity_score * 100).toFixed(1)}%
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className={`card border-${getScoreColor(result.clarity_score)} h-100`}>
            <div className="card-body text-center">
              <h5 className="card-title">Clarity Score</h5>
              <h2 className={`text-${getScoreColor(result.clarity_score)}`}>
                {(result.clarity_score * 100).toFixed(1)}%
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Issues Section */}
      {result.issues && result.issues.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-warning text-dark">
            <h5 className="mb-0">Detected Issues</h5>
          </div>
          <div className="card-body">
            {result.issues.map((issue: any, index: number) => (
              <div key={index} className="mb-3 p-3 border-bottom">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1">Type: {issue.type}</h6>
                    <p className="mb-1"><strong>Found:</strong> "{issue.text}"</p>
                    <p className="mb-0 text-muted">{issue.explanation}</p>
                  </div>
                  <span className={`badge bg-${issue.severity === 'high' ? 'danger' : 
                    issue.severity === 'medium' ? 'warning' : 'info'}`}>
                    {issue.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions Section */}
      {result.suggestions && result.suggestions.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-info text-dark">
            <h5 className="mb-0">Improvement Suggestions</h5>
          </div>
          <div className="card-body">
            {result.suggestions.map((suggestion: any, index: number) => (
              <div key={index} className="mb-3 p-3 border-bottom">
                <h6 className="text-primary mb-2">Original Text:</h6>
                <p className="mb-3 bg-light p-2 rounded">{suggestion.original}</p>
                <h6 className="text-success mb-2">Improved Version:</h6>
                <p className="mb-3 bg-light p-2 rounded">{suggestion.improved}</p>
                <p className="text-muted mb-0">
                  <small><strong>Rationale:</strong> {suggestion.rationale}</small>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Seo keywords */}
      {result.seo_keywords && result.seo_keywords.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-info text-dark">
            <h5 className="mb-0">Seo keywords to add in the text</h5>
          </div>
          <div className="card-body">
            {result.seo_keywords.map((seo_keyword: any, index: number) => (
              <div key={index} className="mb-3 p-3 border-bottom">
                
                <p className="mb-3 bg-light p-2 rounded">{seo_keyword}</p>
                
                
                
              </div>
            ))}
          </div>
        </div>
      )}      {/* Download Button */}
      <div className="text-center mt-4 mb-5 no-print">        <button onClick={handleDownload} className="btn btn-success btn-lg">
          <i className="bi bi-download me-2"></i>
          Download Analysis Report (PDF)
        </button>
      </div>
    </div>
  );
};

export default Analysis;
