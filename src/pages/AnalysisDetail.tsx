

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import html2pdf from 'html2pdf.js';
import '../styles/analysis.css'
import { API_ENDPOINTS } from '../utils/api';
import ImprovedJobDescription from '../components/ImprovedJobDescription';
import JobFileViewer from '../components/JobFileViewer';
import { API_BASE_URL } from '../utils/api'; // Make sure this is imported

interface JobDescription {
  id: string;
  userEmail: string;
  originalText: string;
  improvedText: string;
  fileName: string;
  // Add these new properties for file handling
  originalFileName?: string;
  contentType?: string;
  fileSize: number;
  fileUrl?: string;
  createdAt: string;
  analysis: {
    overall_assessment: string;
    bias_score: number;
    inclusivity_score: number;
    clarity_score: number;
    role: string;
    industry: string;
    issues: Array<{
      type: string;
      text: string;
      severity: string;
      explanation: string;
    }>;
    suggestions: Array<{
      original: string;
      improved: string;
      rationale: string;
      category: string;
    }>;
    seo_keywords: string[];
  };
}

const AnalysisDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<JobDescription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  console.log("the result ", result);
  
  useEffect(() => {
    if (!id) {
      toast.error('Invalid job ID');
      navigate('/jds');
      return;
    }
    
    const fetchAnalysis = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(API_ENDPOINTS.jobs.getById(id));
        setResult(response.data);
      } catch (error) {
        console.error('Error fetching analysis:', error);
        toast.error('Failed to load analysis');
        navigate('/jds');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAnalysis();
    }
  }, [id, navigate]);

  const handleDownload = async () => {
    const content = document.getElementById('analysis-content');
    if (content) {
      try {
        setIsDownloading(true);
        // Clone the element to avoid modifying the original
        const clonedContent = content.cloneNode(true) as HTMLElement;

        // Remove all buttons and navigation elements
        const buttonsToRemove = clonedContent.querySelectorAll('.btn, button, .no-print');
        buttonsToRemove.forEach(btn => btn.remove());

        // Create a temporary container
        const tempContainer = document.createElement('div');
        tempContainer.appendChild(clonedContent);
        document.body.appendChild(tempContainer);
        
        const opt = {
          margin: 1,
          filename: `jd-analysis-${id}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(tempContainer).save();
        // Clean up
        document.body.removeChild(tempContainer);
        toast.success('PDF downloaded successfully');
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error('Failed to generate PDF');
      } finally {
        setIsDownloading(false);
      }
    }
  };

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

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading analysis...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container mt-5 text-center">
        <h3>Analysis not found</h3>
        {/* <Link to="/jds" className="btn btn-primary mt-3">Back to Job Listings</Link> */}
      </div>
    );
  }

  // Check if all three scores are 0
  const allScoresZero = result.analysis.bias_score === 0 && 
                       result.analysis.inclusivity_score === 0 && 
                       result.analysis.clarity_score === 0;

  return (
    <div className="analysis-container" id="analysis-content">
      <div className="d-flex justify-content-between align-items-center mb-4 no-print">
        <h2>Job Description Analysis </h2>
        <div>
          {/* <Link to="/jds" className="btn btn-outline-primary me-2">Back to Listings</Link> */}
          <Link to="/" className="btn btn-primary">Analyze New JD </Link>
        </div>
      </div>

      <div className='mb-3'><h3>{result.fileName}</h3></div>

      {/* ADD THE FILE VIEWER HERE */}
      {result.fileUrl && (
        <div className="card mb-4">
          <div className="card-header bg-secondary text-white">
            <h5 className="mb-0">📎 Uploaded File</h5>
          </div>
          <div className="card-body">
            <JobFileViewer job={result}  />
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
                    backgroundColor: getBiasScoreColor(result.analysis.bias_score),
                    color: 'white',
                    marginRight: '8px'
                  }}>
                    {getBiasScoreText(result.analysis.bias_score)}
                  </span>
                  <strong>{(result.analysis.bias_score * 100).toFixed(1)}%</strong>
                </div>
              </div>
              <div className="progress">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ 
                    width: `${result.analysis.bias_score * 100}%`,
                    backgroundColor: getBiasScoreColor(result.analysis.bias_score)
                  }}
                  aria-valuenow={result.analysis.bias_score * 100} 
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
                    backgroundColor: getPositiveScoreColor(result.analysis.inclusivity_score),
                    color: 'white',
                    marginRight: '8px'
                  }}>
                    {getPositiveScoreText(result.analysis.inclusivity_score)}
                  </span>
                  <strong>{(result.analysis.inclusivity_score * 100).toFixed(1)}%</strong>
                </div>
              </div>
              <div className="progress">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ 
                    width: `${result.analysis.inclusivity_score * 100}%`,
                    backgroundColor: getPositiveScoreColor(result.analysis.inclusivity_score)
                  }}
                  aria-valuenow={result.analysis.inclusivity_score * 100} 
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
                    backgroundColor: getPositiveScoreColor(result.analysis.clarity_score),
                    color: 'white',
                    marginRight: '8px'
                  }}>
                    {getPositiveScoreText(result.analysis.clarity_score)}
                  </span>
                  <strong>{(result.analysis.clarity_score * 100).toFixed(1)}%</strong>
                </div>
              </div>
              <div className="progress">
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ 
                    width: `${result.analysis.clarity_score * 100}%`,
                    backgroundColor: getPositiveScoreColor(result.analysis.clarity_score)
                  }}
                  aria-valuenow={result.analysis.clarity_score * 100} 
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
      {!allScoresZero && result.analysis.role && (
        <div className="card mb-4">
          <div className="card-header  bg-secondary text-white">
            <h5 className="mb-0">Job Role </h5>
          </div>
          <div className="card-body">
            <p className="lead mb-0">{result.analysis.role}</p>
          </div>
        </div>
      )}

      {!allScoresZero && result.analysis.industry && (
        <div className="card mb-4">
          <div className="card-header  bg-secondary text-white">
            <h5 className="mb-0">Job Industry </h5>
          </div>
          <div className="card-body">
            <p className="lead mb-0">{result.analysis.industry}</p>
          </div>
        </div>
      )}

      {/* Always show overall assessment */}
      {result.analysis.overall_assessment && (
        <div className="card mb-4">
          <div className="card-header bg-secondary text-white">
            <h5 className="mb-0">Overall Assessment </h5>
          </div>
          <div className="card-body">
            <p className="lead mb-0">{result.analysis.overall_assessment}</p>
          </div>
        </div>
      )}

      {/* Show other sections only if not all scores are zero */}
      {!allScoresZero && (
        <>
          {/* Issues Section */}
          <div className="card mb-4">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">Detected  Biased Issues</h5>
            </div>
            <div className="card-body">
              {(!result.analysis.issues || result.analysis.issues.length === 0) ? (
                <div className="text-center py-4">
                  <i className="bi bi-check-circle text-success" style={{ fontSize: '2rem' }}></i>
                  <p className="lead mb-0 mt-2">No issues found! Your job description looks good.</p>
                </div>
              ) : (
                result.analysis.issues.map((issue, index) => (
                  <div key={index} className="issue-item mb-3">
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
              {(!result.analysis.suggestions || result.analysis.suggestions.length === 0) ? (
                <div className="text-center py-4">
                  <i className="bi bi-lightbulb text-info" style={{ fontSize: '2rem' }}></i>
                  <p className="lead mb-0 mt-2">
                    No suggestions needed! Your job description is well-written.
                  </p>
                </div>
              ) : (
                result.analysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="suggestion-item mb-3">
                    <h6 className="text-primary mb-2">Category:</h6>
                    <p className="mb-3 bg-light p-2 rounded">{suggestion.category}</p>
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

        

            {/* Improved Job Description Section */}
          {result.improvedText && (
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
          {result.analysis.seo_keywords && result.analysis.seo_keywords.length > 0 && (
            <div className="card mb-4">
              <div className="card-header  bg-secondary text-dark">
                <h5 className="mb-0">SEO Keywords to Add</h5>
              </div>
              <div className="card-body">
                {result.analysis.seo_keywords.map((keyword, index) => (
                  <div key={index} className="mb-3 p-3 border-bottom">
                    <p className="mb-3 bg-light p-2 rounded">{keyword}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Side-by-Side Comparison Section */}
          {result.improvedText && (
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
                      <div className="comparison-header  text-white">
                        <h6 className="mb-0 p-3">
                          <i className="bi bi-file-text me-2"></i>
                          Original Job Description
                        </h6>
                      </div>
                      <div className="comparison-content p-3">
                        {result.fileUrl ? (
                          <JobFileViewer job={result} />
                        ) : (
                          <div className="original-document">
                            {result.originalText.split('\n').map((paragraph, index) => (
                              <p key={index} className="mb-3" style={{ lineHeight: '1.6' }}>
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="comparison-section">
                      <div className="comparison-header  text-white">
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

          {/* Download Button */}
          <div className="text-center mt-4 mb-5 no-print">
            <button 
              onClick={handleDownload} 
              className="btn btn-success btn-lg" 
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generating PDF...
                </>
              ) : (
                <>
                  <i className="bi bi-download me-2"></i>
                  Download Analysis Report (PDF)
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalysisDetail;