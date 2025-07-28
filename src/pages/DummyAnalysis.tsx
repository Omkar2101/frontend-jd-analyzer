import React from 'react';
// import { Link } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import '../styles/analysis.css';

const DummyAnalysis: React.FC = () => {
  const result = {
    bias_score: 0.65,
    inclusivity_score: 0.75,
    clarity_score: 0.88,
    issues: [
      {
        type: 'Gender Bias',
        text: 'We are looking for a strong man to lead the team',
        explanation: 'This phrase can be considered gender-biased as it implies only men are strong leaders.',
        severity: 'high'
      },
      {
        type: 'Age Bias',
        text: 'We need young and energetic candidates',
        explanation: 'This can exclude experienced older candidates unfairly.',
        severity: 'medium'
      }
    ],
    suggestions: [
      {
        original: 'We are looking for a strong man to lead the team.',
        improved: 'We are looking for a strong leader to lead the team.',
        rationale: 'Removes gender-specific language to ensure inclusivity.'
      },
      {
        original: 'We need young and energetic candidates.',
        improved: 'We are looking for enthusiastic and motivated individuals.',
        rationale: 'Avoids age bias while keeping the positive tone.'
      }
    ],
    seo_keywords: ['inclusive', 'teamwork', 'collaboration', 'leadership']
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'danger';
  };

  const downloadPDF = () => {
    const content = document.getElementById('analysis-content');
    if (content) {
      const opt = {
        margin: 1,
        filename: 'dummy-jd-analysis.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(content).save();
    }
  };

  return (
    <div className="container py-4" id="analysis-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Job Description Analysis (Dummy)</h2>
      
      </div>

      {/* Score Overview */}
      <div className="row mb-4">
        {[
          { title: 'Bias Score', value: result.bias_score },
          { title: 'Inclusivity Score', value: result.inclusivity_score },
          { title: 'Clarity Score', value: result.clarity_score }
        ].map((item, i) => (
          <div className="col-md-4 mb-3" key={i}>
            <div className={`card border-${getScoreColor(item.value)} h-100`}>
              <div className="card-body text-center">
                <h5 className="card-title">{item.title}</h5>
                <h2 className={`text-${getScoreColor(item.value)}`}>
                  {(item.value * 100).toFixed(1)}%
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Issues Section */}
      <div className="card mb-4">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0">Detected Issues</h5>
        </div>
        <div className="card-body">
          {result.issues.map((issue, index) => (
            <div key={index} className="mb-3 p-3 border-bottom">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="mb-1">Type: {issue.type}</h6>
                  <p className="mb-1"><strong>Found:</strong> "{issue.text}"</p>
                  <p className="mb-0 text-muted">{issue.explanation}</p>
                </div>
                <span className={`badge bg-${issue.severity === 'high' ? 'danger' : issue.severity === 'medium' ? 'warning' : 'info'}`}>
                  {issue.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions Section */}
      <div className="card mb-4">
        <div className="card-header bg-info text-dark">
          <h5 className="mb-0">Improvement Suggestions</h5>
        </div>
        <div className="card-body">
          {result.suggestions.map((suggestion, index) => (
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

      {/* SEO Keywords */}
      <div className="card mb-4">
        <div className="card-header bg-info text-dark">
          <h5 className="mb-0">SEO Keywords to Add</h5>
        </div>
        <div className="card-body">
          {result.seo_keywords.map((keyword, index) => (
            <div key={index} className="mb-3 p-3 border-bottom">
              <p className="mb-3 bg-light p-2 rounded">{keyword}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Download Button */}
      <div className="text-center mt-4 mb-5">
        <button onClick={downloadPDF} className="btn btn-success btn-lg">
          <i className="bi bi-download me-2"></i>
          Download Analysis Report (PDF)
        </button>
      </div>
    </div>
  );
};

export default DummyAnalysis;
