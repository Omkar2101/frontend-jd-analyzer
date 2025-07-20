// import React, { useEffect,useRef } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import type { RootState } from '../store/store';
// import html2pdf from 'html2pdf.js';
// import '../styles/analysis.css';

// const Download: React.FC = () => {
//   const navigate = useNavigate();
//   const result = useSelector((state: RootState) => state.result.data);
//   const hasDownloaded = useRef(false);

//   useEffect(() => {
//     if (!result) {
//       navigate('/');
//       return;
//     }

//     // Prevent multiple downloads
//     if (hasDownloaded.current) {
//       return;
//     }

//     // Set flag to prevent future executions
//     hasDownloaded.current = true;

//     // Automatically trigger download when component mounts
//     const downloadPDF = () => {
//       const content = document.getElementById('analysis-content');
//       if (content) {
//         const opt = {
//           margin: 1,
//           filename: 'jd-analysis.pdf',
//           image: { type: 'jpeg', quality: 0.98 },
//           html2canvas: { scale: 2 },
//           jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//         };
//         html2pdf().set(opt).from(content).save().then(() => {
//           // Navigate back to analysis page after download starts
//           setTimeout(() => {
//             navigate('/analysis');
//           }, 1000);
//         });
//       }
//     };

//     // Small delay to ensure content is rendered
//     setTimeout(downloadPDF, 500);
//   }, [result, navigate]);

//   // const getScoreColor = (score: number) => {
//   //   if (score >= 0.8) return 'success';
//   //   if (score >= 0.6) return 'warning';
//   //   return 'danger';
//   // };

//     // For bias: high = red, medium = yellow, low = green
//   const getBiasScoreColor = (score: number) => {
//     if (score >= 0.8) return 'danger';     // High bias - Red
//     if (score >= 0.6) return 'warning';    // Medium bias - Yellow
//     return 'success';                      // Low bias - Green
//   };

//   // For inclusivity/clarity: high = green, medium = yellow, low = red
//   const getPositiveScoreColor = (score: number) => {
//     if (score >= 0.8) return 'success';    // High score - Green
//     if (score >= 0.6) return 'warning';    // Medium score - Yellow
//     return 'danger';                       // Low score - Red
//   };

//   if (!result) {
//     return null;
//   }

//   return (
//     <div className="container py-4" id="analysis-content">
//       <h2 className="mb-4">Job Description Analysis</h2>

//       {/* Score Overview */}
//       <div className="row mb-4">
//         <div className="col-md-4 mb-3">
//           <div className={`card border-${getBiasScoreColor(result.bias_score)} h-100`}>
//             <div className="card-body text-center">
//               <h5 className="card-title">Bias Score</h5>
//               <h2 className={`text-${getBiasScoreColor(result.bias_score)}`}>
//                 {(result.bias_score * 100).toFixed(1)}%
//               </h2>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-4 mb-3">
//           <div className={`card border-${getPositiveScoreColor(result.inclusivity_score)} h-100`}>
//             <div className="card-body text-center">
//               <h5 className="card-title">Inclusivity Score</h5>
//               <h2 className={`text-${getPositiveScoreColor(result.inclusivity_score)}`}>
//                 {(result.inclusivity_score * 100).toFixed(1)}%
//               </h2>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-4 mb-3">
//           <div className={`card border-${getPositiveScoreColor(result.clarity_score)} h-100`}>
//             <div className="card-body text-center">
//               <h5 className="card-title">Clarity Score</h5>
//               <h2 className={`text-${getPositiveScoreColor(result.clarity_score)}`}>
//                 {(result.clarity_score * 100).toFixed(1)}%
//               </h2>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Overall Assessment */}
//        {result.role && (
//         <div className="card mb-4">
//           <div className="card-header bg-tri text-white">
//             <h5 className="mb-0">Job Role </h5>
//           </div>
//           <div className="card-body">
//             <p className="lead mb-0">{result.role}</p>
//           </div>
//         </div>
//       )}
      
//        {result.industry && (
//         <div className="card mb-4">
//           <div className="card-header bg-success text-white">
//             <h5 className="mb-0">Job Industry </h5>
//           </div>
//           <div className="card-body">
//             <p className="lead mb-0">{result.industry}</p>
//           </div>
//         </div>
//       )}
//       {result.overall_assessment && (
//         <div className="card mb-4">
//           <div className="card-header bg-primary text-white">
//             <h5 className="mb-0">Overall Assessment </h5>
//           </div>
//           <div className="card-body">
//             <p className="lead mb-0">{result.overall_assessment}</p>
//           </div>
//         </div>
//       )}

//       {/* Issues Section */}
//       {result.issues && result.issues.length > 0 && (
//         <div className="card mb-4">
//           <div className="card-header bg-warning text-dark">
//             <h5 className="mb-0">Detected Issues</h5>
//           </div>
//           <div className="card-body">
//             {result.issues.map((issue: any, index: number) => (
//               <div key={index} className="mb-3 p-3 border-bottom">
//                 <div className="d-flex justify-content-between align-items-start">
//                   <div>
//                     <h6 className="mb-1">Type: {issue.type}</h6>
//                     <p className="mb-1"><strong>Found:</strong> "{issue.text}"</p>
//                     <p className="mb-0 text-muted">{issue.explanation}</p>
//                   </div>
//                   <span className={`badge bg-${issue.severity === 'high' ? 'danger' : 
//                     issue.severity === 'medium' ? 'warning' : 'info'}`}>
//                     {issue.severity}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Suggestions Section */}
//       {result.suggestions && result.suggestions.length > 0 && (
//         <div className="card mb-4">
//           <div className="card-header bg-info text-dark">
//             <h5 className="mb-0">Improvement Suggestions</h5>
//           </div>
//           <div className="card-body">
//             {result.suggestions.map((suggestion: any, index: number) => (
//               <div key={index} className="mb-3 p-3 border-bottom">
//                 <h6 className="text-primary mb-2">Original Text:</h6>
//                 <p className="mb-3 bg-light p-2 rounded">{suggestion.original}</p>
//                 <h6 className="text-success mb-2">Improved Version:</h6>
//                 <p className="mb-3 bg-light p-2 rounded">{suggestion.improved}</p>
//                 <p className="text-muted mb-0">
//                   <small><strong>Rationale:</strong> {suggestion.rationale}</small>
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Seo keywords */}
//       {result.seo_keywords && result.seo_keywords.length > 0 && (
//         <div className="card mb-4">
//           <div className="card-header bg-info text-dark">
//             <h5 className="mb-0">Seo keywords to add in the text</h5>
//           </div>
//           <div className="card-body">
//             {result.seo_keywords.map((seo_keyword: any, index: number) => (
//               <div key={index} className="mb-3 p-3 border-bottom">
//                 <p className="mb-3 bg-light p-2 rounded">{seo_keyword}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Download;


import React, { useEffect,useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store';
import html2pdf from 'html2pdf.js';
import '../styles/analysis.css';

const Download: React.FC = () => {
  const navigate = useNavigate();
  const result = useSelector((state: RootState) => state.result.data);
  const hasDownloaded = useRef(false);

  useEffect(() => {
    if (!result) {
      navigate('/');
      return;
    }

    // Prevent multiple downloads
    if (hasDownloaded.current) {
      return;
    }

    // Set flag to prevent future executions
    hasDownloaded.current = true;

    // Automatically trigger download when component mounts
    const downloadPDF = () => {
      const content = document.getElementById('analysis-content');
      if (content) {
        const opt = {
          margin: 1,
          filename: 'jd-analysis.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(content).save().then(() => {
          // Navigate back to analysis page after download starts
          setTimeout(() => {
            navigate('/analysis');
          }, 1000);
        });
      }
    };

    // Small delay to ensure content is rendered
    setTimeout(downloadPDF, 500);
  }, [result, navigate]);

  // Check if all three scores are 0
  const allScoresZero = result && result.bias_score === 0 && 
                       result.inclusivity_score === 0 && 
                       result.clarity_score === 0;

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

  if (!result) {
    return null;
  }

  return (
    <div className="container py-4" id="analysis-content">
      <h2 className="mb-4">Job Description Analysis</h2>

      {/* Show scores only if not all zero */}
      {!allScoresZero && (
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className={`card border-${getBiasScoreColor(result.bias_score)} h-100`}>
              <div className="card-body text-center">
                <h5 className="card-title">Bias Score</h5>
                <h2 className={`text-${getBiasScoreColor(result.bias_score)}`}>
                  {(result.bias_score * 100).toFixed(1)}%
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className={`card border-${getPositiveScoreColor(result.inclusivity_score)} h-100`}>
              <div className="card-body text-center">
                <h5 className="card-title">Inclusivity Score</h5>
                <h2 className={`text-${getPositiveScoreColor(result.inclusivity_score)}`}>
                  {(result.inclusivity_score * 100).toFixed(1)}%
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className={`card border-${getPositiveScoreColor(result.clarity_score)} h-100`}>
              <div className="card-body text-center">
                <h5 className="card-title">Clarity Score</h5>
                <h2 className={`text-${getPositiveScoreColor(result.clarity_score)}`}>
                  {(result.clarity_score * 100).toFixed(1)}%
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show job role and industry only if not all scores are zero */}
      {!allScoresZero && result.role && (
        <div className="card mb-4">
          <div className="card-header bg-tri text-white">
            <h5 className="mb-0">Job Role </h5>
          </div>
          <div className="card-body">
            <p className="lead mb-0">{result.role}</p>
          </div>
        </div>
      )}
      
      {!allScoresZero && result.industry && (
        <div className="card mb-4">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">Job Industry </h5>
          </div>
          <div className="card-body">
            <p className="lead mb-0">{result.industry}</p>
          </div>
        </div>
      )}

      {/* Always show overall assessment */}
      {result.overall_assessment && (
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Overall Assessment </h5>
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
              <h5 className="mb-0">Detected Issues</h5>
            </div>
            <div className="card-body">
              {!result.issues || result.issues.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-check-circle text-success fs-2"></i>
                  <p className="lead mb-0 mt-2">
                    No issues found! Your job description looks good.
                  </p>
                </div>
              ) : (
                result.issues.map((issue: any, index: number) => (
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
          <div className="card mb-4">
            <div className="card-header bg-info text-dark">
              <h5 className="mb-0">Improvement Suggestions</h5>
            </div>
            <div className="card-body">
              {!result.suggestions || result.suggestions.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-lightbulb text-info fs-2"></i>
                  <p className="lead mb-0 mt-2">
                    No suggestions needed! Your job description is well-written.
                  </p>
                </div>
              ) : (
                result.suggestions.map((suggestion: any, index: number) => (
                  <div key={index} className="mb-3 p-3 border-bottom">
                    <h6 className="text-primary mb-2">Original Text:</h6>
                    <p className="mb-3 bg-light p-2 rounded">{suggestion.original}</p>
                    <h6 className="text-success mb-2">Improved Version:</h6>
                    <p className="mb-3 bg-light p-2 rounded">{suggestion.improved}</p>
                    <p className="text-muted mb-0">
                      <small><strong>Rationale:</strong> {suggestion.rationale}</small>
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SEO keywords */}
          {result.seo_keywords && result.seo_keywords.length > 0 && (
            <div className="card mb-4">
              <div className="card-header bg-info text-dark">
                <h5 className="mb-0">SEO keywords to add in the text</h5>
              </div>
              <div className="card-body">
                {result.seo_keywords.map((seo_keyword: any, index: number) => (
                  <div key={index} className="mb-3 p-3 border-bottom">
                    <p className="mb-3 bg-light p-2 rounded">{seo_keyword}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Download;