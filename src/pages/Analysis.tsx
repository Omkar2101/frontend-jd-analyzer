

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { RootState } from "../store/store";
import ImprovedJobDescription from "../components/ImprovedJobDescription";
import JobFileViewer from '../components/JobFileViewer';
import { API_ENDPOINTS } from '../utils/api';
import "../styles/analysis.css";

  interface Issue {
  type: string;
  text: string;
  explanation: string;
  severity: 'high' | 'medium' | 'low';
}

interface Suggestion {
  category?: string;
  original: string;
  improved: string;
  rationale: string;
}



const Analysis: React.FC = () => {



  
  const navigate = useNavigate();
  const result = useSelector((state: RootState) => state.result.data);
  
  console.log("Analysis result:", result);

  useEffect(() => {
    if (!result) {
      navigate("/");
    }
  }, [result, navigate]);

  if (!result) {
    return (
      <div className="container mt-5 text-center">
        <h3>No analysis data available</h3>
        <Link to="/" className="btn btn-primary mt-3">
          Analyze New Job Description
        </Link>
      </div>
    );
  }

  // Check if all three scores are 0
  const allScoresZero = result.bias_score === 0 && 
                       result.inclusivity_score === 0 && 
                       result.clarity_score === 0;

  // For bias: low bias = green, high bias = red
  const getBiasScoreColor = (score: number) => {
    if (score >= 0.8) return '#dc3545';     // High bias - Red
    if (score >= 0.6) return '#ffc107';    // Medium bias - Yellow
    return '#28a745';                      // Low bias - Green
  };

  // For inclusivity/clarity: high score = green, low score = red
  const getPositiveScoreColor = (score: number) => {
    if (score >= 0.8) return '#28a745';    // High score - Green
    if (score >= 0.6) return '#ffc107';    // Medium score - Yellow
    return '#dc3545';                       // Low score - Red
  };

  // Get bias score interpretation (inverted logic)
  const getBiasScoreText = (score: number) => {
    if (score >= 0.8) return 'High Bias';
    if (score >= 0.6) return 'Medium Bias';
    return 'Low Bias';
  };

  // Get positive score interpretation
  const getPositiveScoreText = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    return 'Needs Improvement';
  };

  // Debug logs
  console.log("File URL:", result.fileUrl);
  console.log("Stored File Name:", result.storedFileName);
  console.log("Improved Text:", result.improvedText);
  console.log("Original Text:", result.originalText);

  return (
    <div className="analysis-container" id="analysis-content">
      <div className="d-flex justify-content-between align-items-center mb-4 no-print">
        <h2>Job Description Analysis</h2>
        <div>
          <Link to="/" className="btn btn-primary">Analyze New JD</Link>
        </div>
      </div>

      <div className='mb-3'>
        <h3>{result.fileName || result.originalFileName || 'Job Description Analysis'}</h3>
      </div>

     {(result.fileName == "Direct Input") && (
        <div className="card mb-4">
          <div className="card-header  bg-secondary text-white">
            <h5 className="mb-0">Text Input</h5>
          </div>
          <div className="card-body">
            <p className="lead mb-0">{result.originalText}</p>
          </div>
        </div>
          
      )}

      {/* FILE VIEWER SECTION */}
      {(result.fileUrl || result.storedFileName) && (
        <div className="card mb-4">
          <div className="card-header bg-secondary text-white">
            <h5 className="mb-0">📎 Uploaded File</h5>
          </div>
          <div className="card-body">
            {/* Create a job object that matches what JobFileViewer expects */}
            <JobFileViewer job={{
              ...result,
              fileUrl: result.fileUrl || API_ENDPOINTS.files.viewFile(result.storedFileName),
              originalFileName: result.originalFileName || result.fileName,
              contentType: result.contentType,
              fileSize: result.fileSize
            }} />
          </div>
        </div>
      )}

     

      {/* Analysis Matrix with Bars */}
      {!allScoresZero && (
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">📊 Analysis Matrix</h5>
          </div>
          <div className="card-body p-4">
            {/* Bias Score Bar */}
            <div className="score-item">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0 fw-bold">Bias Level</h6>
                <div className="d-flex align-items-center">
                  <span className="badge" style={{ 
                    backgroundColor: getBiasScoreColor(result.bias_score),
                    color: 'white',
                    marginRight: '8px'
                  }}>
                    {getBiasScoreText(result.bias_score)}
                  </span>
                  <strong>{(result.bias_score * 100).toFixed(1)}%</strong>
                </div>
              </div>
              <div className="progress">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ 
                    width: `${result.bias_score * 100}%`,
                    backgroundColor: getBiasScoreColor(result.bias_score)
                  }}
                  aria-valuenow={result.bias_score * 100} 
                  aria-valuemin={0} 
                  aria-valuemax={100}
                >
                </div>
              </div>
            </div>

            {/* Inclusivity Score Bar */}
            <div className="score-item">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0 fw-bold">Inclusivity Score</h6>
                <div className="d-flex align-items-center">
                  <span className="badge" style={{ 
                    backgroundColor: getPositiveScoreColor(result.inclusivity_score),
                    color: 'white',
                    marginRight: '8px'
                  }}>
                    {getPositiveScoreText(result.inclusivity_score)}
                  </span>
                  <strong>{(result.inclusivity_score * 100).toFixed(1)}%</strong>
                </div>
              </div>
              <div className="progress">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ 
                    width: `${result.inclusivity_score * 100}%`,
                    backgroundColor: getPositiveScoreColor(result.inclusivity_score)
                  }}
                  aria-valuenow={result.inclusivity_score * 100} 
                  aria-valuemin={0} 
                  aria-valuemax={100}
                >
                </div>
              </div>
            </div>

            {/* Clarity Score Bar */}
            <div className="score-item">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0 fw-bold">Clarity Score</h6>
                <div className="d-flex align-items-center">
                  <span className="badge" style={{ 
                    backgroundColor: getPositiveScoreColor(result.clarity_score),
                    color: 'white',
                    marginRight: '8px'
                  }}>
                    {getPositiveScoreText(result.clarity_score)}
                  </span>
                  <strong>{(result.clarity_score * 100).toFixed(1)}%</strong>
                </div>
              </div>
              <div className="progress">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ 
                    width: `${result.clarity_score * 100}%`,
                    backgroundColor: getPositiveScoreColor(result.clarity_score)
                  }}
                  aria-valuenow={result.clarity_score * 100} 
                  aria-valuemin={0} 
                  aria-valuemax={100}
                >
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show job role and industry only if not all scores are zero */}
      {!allScoresZero && result.role && (
        <div className="card mb-4">
          <div className="card-header  bg-secondary text-white">
            <h5 className="mb-0">Job Role</h5>
          </div>
          <div className="card-body">
            <p className="lead mb-0">{result.role}</p>
          </div>
        </div>
      )}
      
      {!allScoresZero && result.industry && (
        <div className="card mb-4">
          <div className="card-header  bg-secondary text-white">
            <h5 className="mb-0">Job Industry</h5>
          </div>
          <div className="card-body">
            <p className="lead mb-0">{result.industry}</p>
          </div>
        </div>
      )}

      {/* Always show overall assessment */}
      {result.overall_assessment && (
        <div className="card mb-4">
          <div className="card-header  bg-secondary text-white">
            <h5 className="mb-0">Overall Assessment</h5>
          </div>
          <div className="card-body">
            <p className="lead mb-0">{result.overall_assessment}</p>
          </div>
        </div>
      )}

      {/* Show other sections only if not all scores are zero */}
      {!allScoresZero && (
        <>
          {/* Issues Section */}
          <div className="card mb-4">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">Detected Biased Issues</h5>
            </div>
            <div className="card-body">
              {!result.issues || result.issues.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-check-circle text-success" style={{ fontSize: '2rem' }}></i>
                  <p className="lead mb-0 mt-2">
                    No issues found! Your job description looks good.
                  </p>
                </div>
              ) : (
                result.issues.map((issue: Issue, index: number) => (
                  <div key={index} className="issue-item mb-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">Type: {issue.type}</h6>
                        <p className="mb-1">
                          <strong>Found:</strong> "{issue.text}"
                        </p>
                        <p className="mb-0 text-muted">{issue.explanation}</p>
                      </div>
                      <span
                        className={`badge bg-${
                          issue.severity === "high"
                            ? "danger"
                            : issue.severity === "medium"
                            ? "warning"
                            : "info"
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

         

          {/* Suggestions Section - NOW ALWAYS SHOWN */}
          <div className="card mb-4">
            <div className="card-header bg-info text-dark">
              <h5 className="mb-0">Improvement Suggestions for Inclusiveness and Clarity Issues</h5>
            </div>
            <div className="card-body">
              {!result.suggestions || result.suggestions.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-lightbulb text-info" style={{ fontSize: '2rem' }}></i>
                  <p className="lead mb-0 mt-2">
                    No suggestions needed! Your job description is well-written.
                  </p>
                </div>
              ) : (
                result.suggestions.map((suggestion: Suggestion, index: number) => (
                  <div key={index} className="suggestion-item mb-3">
                    {suggestion.category && (
                      <>
                        <h6 className="text-primary mb-2">Category:</h6>
                        <p className="mb-3 bg-light p-2 rounded">{suggestion.category}</p>
                      </>
                    )}
                    <h6 className="text-primary mb-2">Original Text:</h6>
                    <div className="original-text mb-3">{suggestion.original}</div>
                    <h6 className="text-success mb-2">Improved Version:</h6>
                    <div className="improved-text mb-3">{suggestion.improved}</div>
                    <p className="rationale mb-0">
                      <small><strong>Rationale:</strong> {suggestion.rationale}</small>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

           {/* Improved Job Description Section - MOVED BEFORE SUGGESTIONS */}
          {result.improvedText && result.improvedText.trim() && (
            <div className="card mb-4">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">📝 Improved Job Description</h5>
                <small className="opacity-75">
                  Here's your job description with all issues resolved and optimized for better clarity and inclusivity
                </small>
              </div>
              <div className="card-body p-0">
                <ImprovedJobDescription improvedText={result.improvedText} />
              </div>
            </div>
          )}

          {/* SEO Keywords */}
          {result.seo_keywords && result.seo_keywords.length > 0 && (
            <div className="card mb-4">
              <div className="card-header  bg-secondary text-dark">
                <h5 className="mb-0">SEO Keywords to Add</h5>
              </div>
              <div className="card-body">
                {result.seo_keywords.map((keyword: string, index: number) => (
                  <div key={index} className="mb-3 p-3 border-bottom">
                    <p className="mb-3 bg-light p-2 rounded">{keyword}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Side-by-Side Comparison Section - NEW ADDITION */}
          {result.improvedText && result.improvedText.trim() && (
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">📋 Compare: Original vs Improved</h5>
                <small className="opacity-75">
                  Side-by-side comparison to see the improvements made to your job description
                </small>
              </div>
              <div className="card-body p-0">
                <div className="row g-0">
                  <div className="col-md-6 border-end">
                    <div className="comparison-section">
                      <div className="comparison-header text-white">
                        <h6 className="mb-0 p-3">
                          <i className="bi bi-file-text me-2"></i>
                          Original Job Description
                        </h6>
                      </div>
                      <div className="comparison-content p-3">
                        {result.fileName === "Direct Input" ? (
                          <div className="original-document">
                            {result.originalText.split('\n').map((paragraph: string, index: number) => (
                              <p key={index} className="mb-3" style={{ lineHeight: '1.6' }}>
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <JobFileViewer job={{
                            ...result,
                            fileUrl: result.fileUrl || API_ENDPOINTS.files.viewFile(result.storedFileName),
                            originalFileName: result.originalFileName || result.fileName,
                            contentType: result.contentType,
                            fileSize: result.fileSize
                          }} />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="comparison-section">
                      <div className="comparison-header text-white">
                        <h6 className="mb-0 p-3">
                          <i className="bi bi-file-check me-2"></i>
                          Improved Job Description
                        </h6>
                      </div>
                      <div className="comparison-content p-0">
                        <ImprovedJobDescription improvedText={result.improvedText} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Analysis;