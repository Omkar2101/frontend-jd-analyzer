import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import html2pdf from 'html2pdf.js';
import '../styles/analysis.css'

interface JobDescription {
  id: string;
  userEmail: string;
  originalText: string;
  improvedText: string;
  overallAssessment: string;
  fileName: string;
  createdAt: string;
  analysis: {
    bias_score: number;
    inclusivity_score: number;
    clarity_score: number;
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
  const [result, setResult] = useState<JobDescription | null>(null);  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  console.log("the result ",result);
  
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5268/api/jobs/${id}`);
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
  }, [id, navigate]);  const handleDownload = async () => {
    const content = document.getElementById('analysis-content');
    if (content) {
      try {
        setIsDownloading(true);
        const opt = {
          margin: 1,
          filename: `jd-analysis-${id}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        await html2pdf().set(opt).from(content).save();
        toast.success('PDF downloaded successfully');
      } catch (error) {
        console.error('Error generating PDF:', error);
        toast.error('Failed to generate PDF');
      } finally {
        setIsDownloading(false);
      }
    }
  };

  // For bias: high = red, medium = yellow, low = green
  const getBiasScoreColor = (score: number) => {
    if (score >= 0.8) return 'danger';     // High bias - Red
    if (score >= 0.6) return 'warning';    // Medium bias - Yellow
    return 'success';                      // Low bias - Green
  };

  // For inclusivity/clarity: high = green, medium = yellow, low = red
  const getPositiveScoreColor = (score: number) => {
    if (score >= 0.8) return 'success';    // High score - Green
    if (score >= 0.6) return 'warning';    // Medium score - Yellow
    return 'danger';                       // Low score - Red
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

  return (
    <div className="container py-4" id="analysis-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Job Description Analysis</h2>
        <div>
          {/* <Link to="/jds" className="btn btn-outline-primary me-2">Back to Listings</Link> */}
          <Link to="/" className="btn btn-outline-primary">Analyze New JD</Link>
        </div>
      </div>

      {/* Score Overview */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className={`card border-${getBiasScoreColor(result.analysis.bias_score)} h-100`}>
            <div className="card-body text-center">
              <h5 className="card-title">Bias Score</h5>
              <h2 className={`text-${getBiasScoreColor(result.analysis.bias_score)}`}>
                {(result.analysis.bias_score * 100).toFixed(1)}%
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className={`card border-${getPositiveScoreColor(result.analysis.inclusivity_score)} h-100`}>
            <div className="card-body text-center">
              <h5 className="card-title">Inclusivity Score</h5>
              <h2 className={`text-${getPositiveScoreColor(result.analysis.inclusivity_score)}`}>
                {(result.analysis.inclusivity_score * 100).toFixed(1)}%
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className={`card border-${getPositiveScoreColor(result.analysis.clarity_score)} h-100`}>
            <div className="card-body text-center">
              <h5 className="card-title">Clarity Score</h5>
              <h2 className={`text-${getPositiveScoreColor(result.analysis.clarity_score)}`}>
                {(result.analysis.clarity_score * 100).toFixed(1)}%
              </h2>
            </div>
          </div>
        </div>
      </div>

        {/* Overall Assessment */}
      {result.overallAssessment && (
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Overall Assessment</h5>
          </div>
          <div className="card-body">
            <p className="lead mb-0">{result.overallAssessment}</p>
          </div>
        </div>
      )}

      {/* Issues Section */}
      <div className="card mb-4">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0">Detected Issues</h5>
        </div>
        <div className="card-body">
          {(!result.analysis.issues || result.analysis.issues.length === 0) ? (
            <div className="text-center py-4">
              <i className="bi bi-check-circle text-success" style={{ fontSize: '2rem' }}></i>
              <p className="lead mb-0 mt-2">No issues found! Your job description looks good.</p>
            </div>
          ) : (
            result.analysis.issues.map((issue, index) => (
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
            ))
          )}
        </div>
      </div>

      {/* Suggestions Section */}
      {result.analysis.suggestions && result.analysis.suggestions.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-info text-dark">
            <h5 className="mb-0">Improvement Suggestions</h5>
          </div>
          <div className="card-body">
            {result.analysis.suggestions.map((suggestion, index) => (
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

      {/* SEO Keywords */}
      {result.analysis.seo_keywords && result.analysis.seo_keywords.length > 0 && (
        <div className="card mb-4">
          <div className="card-header bg-info text-dark">
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
      )}      {/* Download Button */}
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
    </div>
  );
};

export default AnalysisDetail;
