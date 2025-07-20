

// import React, { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
// import type { RootState } from "../store/store";
// import "../styles/analysis.css";

// const Analysis: React.FC = () => {
//   const navigate = useNavigate();
//   const result = useSelector((state: RootState) => state.result.data);
//   console.log(result);

//   useEffect(() => {
//     if (!result) {
//       navigate("/");
//     }
//   }, [result, navigate]);

//   if (!result) {
//     return (
//       <div className="container mt-5 text-center">
//         <h3>No analysis data available</h3>
//         <Link to="/" className="btn btn-primary mt-3">
//           Analyze New Job Description
//         </Link>
//       </div>
//     );
//   }

//   const handleDownload = () => {
//     navigate("/download");
//   };

//   // Check if all three scores are 0
//   const allScoresZero = result.bias_score === 0 && 
//                        result.inclusivity_score === 0 && 
//                        result.clarity_score === 0;

//   // Color for bias score (lower is better)
//   const getBiasColor = (score: number) => {
//     if (score >= 0.8) return "danger"; // High bias - Red
//     if (score >= 0.6) return "warning"; // Medium bias - Yellow
//     return "success"; // Low bias - Green
//   };

//   // Color for positive scores (higher is better)
//   const getPositiveColor = (score: number) => {
//     if (score >= 0.8) return "success"; // High = Green
//     if (score >= 0.6) return "warning"; // Medium = Yellow
//     return "danger"; // Low = Red
//   };

//   return (
//     <div className="container py-4" id="analysis-content">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div className="d-flex align-items-center">
//           <h2 className="mb-0">Job Description Analysis</h2>
//         </div>
//         <div className="d-flex align-items-center gap-2">
          
//           <Link to="/" className="btn btn-outline-primary">
//             Analyze New JD
//           </Link>
//         </div>
//       </div>

//       {/* Show scores only if not all zero */}
//       {!allScoresZero && (
//         <div className="row mb-4">
//           <div className="col-md-4 mb-3">
//             <div
//               className={`card border-${getBiasColor(result.bias_score)} h-100`}
//             >
//               <div className="card-body text-center">
//                 <h5 className="card-title">Bias Score</h5>
//                 <h2 className={`text-${getBiasColor(result.bias_score)}`}>
//                   {(result.bias_score * 100).toFixed(1)}%
//                 </h2>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-4 mb-3">
//             <div
//               className={`card border-${getPositiveColor(
//                 result.inclusivity_score
//               )} h-100`}
//             >
//               <div className="card-body text-center">
//                 <h5 className="card-title">Inclusivity Score</h5>
//                 <h2
//                   className={`text-${getPositiveColor(result.inclusivity_score)}`}
//                 >
//                   {(result.inclusivity_score * 100).toFixed(1)}%
//                 </h2>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-4 mb-3">
//             <div
//               className={`card border-${getPositiveColor(
//                 result.clarity_score
//               )} h-100`}
//             >
//               <div className="card-body text-center">
//                 <h5 className="card-title">Clarity Score</h5>
//                 <h2 className={`text-${getPositiveColor(result.clarity_score)}`}>
//                   {(result.clarity_score * 100).toFixed(1)}%
//                 </h2>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Show job role and industry only if not all scores are zero */}
//       {!allScoresZero && result.role && (
//         <div className="card mb-4">
//           <div className="card-header bg-tri text-white">
//             <h5 className="mb-0">Job Role </h5>
//           </div>
//           <div className="card-body">
//             <p className="lead mb-0">{result.role}</p>
//           </div>
//         </div>
//       )}
      
//       {!allScoresZero && result.industry && (
//         <div className="card mb-4">
//           <div className="card-header bg-success text-white">
//             <h5 className="mb-0">Job Industry </h5>
//           </div>
//           <div className="card-body">
//             <p className="lead mb-0">{result.industry}</p>
//           </div>
//         </div>
//       )}

//       {/* Always show overall assessment */}
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

//       {/* Show other sections only if not all scores are zero */}
//       {!allScoresZero && (
//         <>
//           {/* Issues Section */}
//           <div className="card mb-4">
//             <div className="card-header bg-warning text-dark">
//               <h5 className="mb-0">Detected Issues</h5>
//             </div>
//             <div className="card-body">
//               {!result.issues || result.issues.length === 0 ? (
//                 <div className="text-center py-4">
//                   <i
//                     className="bi bi-check-circle text-success fs-2"
                    
//                   ></i>
//                   <p className="lead mb-0 mt-2">
//                     No issues found! Your job description looks good.
//                   </p>
//                 </div>
//               ) : (
//                 result.issues.map((issue: any, index: number) => (
//                   <div key={index} className="mb-3 p-3 border-bottom">
//                     <div className="d-flex justify-content-between align-items-start">
//                       <div>
//                         <h6 className="mb-1">Type: {issue.type}</h6>
//                         <p className="mb-1">
//                           <strong>Found:</strong> "{issue.text}"
//                         </p>
//                         <p className="mb-0 text-muted">{issue.explanation}</p>
//                       </div>
//                       <span
//                         className={`badge bg-${
//                           issue.severity === "high"
//                             ? "danger"
//                             : issue.severity === "medium"
//                             ? "warning"
//                             : "info"
//                         }`}
//                       >
//                         {issue.severity}
//                       </span>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Suggestions Section */}
//           {result.suggestions && result.suggestions.length > 0 && (
//             <div className="card mb-4">
//               <div className="card-header bg-info text-dark">
//                 <h5 className="mb-0">Improvement Suggestions</h5>
//               </div>
//               <div className="card-body">
//                 {result.suggestions.map((suggestion: any, index: number) => (
//                   <div key={index} className="mb-3 p-3 border-bottom">
//                     <h6 className="text-primary mb-2">Original Text:</h6>
//                     <p className="mb-3 bg-light p-2 rounded">
//                       {suggestion.original}
//                     </p>
//                     <h6 className="text-success mb-2">Improved Version:</h6>
//                     <p className="mb-3 bg-light p-2 rounded">
//                       {suggestion.improved}
//                     </p>
//                     <p className="text-muted mb-0">
//                       <small>
//                         <strong>Rationale:</strong> {suggestion.rationale}
//                       </small>
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* SEO keywords */}
//           {result.seo_keywords && result.seo_keywords.length > 0 && (
//             <div className="card mb-4">
//               <div className="card-header bg-info text-dark">
//                 <h5 className="mb-0">SEO keywords to add in the text</h5>
//               </div>
//               <div className="card-body">
//                 {result.seo_keywords.map((seo_keyword: any, index: number) => (
//                   <div key={index} className="mb-3 p-3 border-bottom">
//                     <p className="mb-3 bg-light p-2 rounded">{seo_keyword}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Download Button */}
//           <div className="text-center mt-4 mb-5 no-print">
//             <button onClick={handleDownload} className="btn btn-success btn-lg">
//               <i className="bi bi-download me-2"></i>
//               Download Analysis Report (PDF)
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Analysis;
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { RootState } from "../store/store";
import "../styles/analysis.css";

const Analysis: React.FC = () => {
  const navigate = useNavigate();
  const result = useSelector((state: RootState) => state.result.data);
  console.log(result);

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

  const handleDownload = () => {
    navigate("/download");
  };

  // Check if all three scores are 0
  const allScoresZero = result.bias_score === 0 && 
                       result.inclusivity_score === 0 && 
                       result.clarity_score === 0;

  // Color for bias score (lower is better)
  const getBiasColor = (score: number) => {
    if (score >= 0.8) return "danger"; // High bias - Red
    if (score >= 0.6) return "warning"; // Medium bias - Yellow
    return "success"; // Low bias - Green
  };

  // Color for positive scores (higher is better)
  const getPositiveColor = (score: number) => {
    if (score >= 0.8) return "success"; // High = Green
    if (score >= 0.6) return "warning"; // Medium = Yellow
    return "danger"; // Low = Red
  };

  return (
    <div className="container py-4" id="analysis-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <h2 className="mb-0">Job Description Analysis</h2>
        </div>
        <div className="d-flex align-items-center gap-2">
          
          <Link to="/" className="btn btn-primary">
            Analyze New JD
          </Link>
        </div>
      </div>

      {/* Show scores only if not all zero */}
      {!allScoresZero && (
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div
              className={`card border-${getBiasColor(result.bias_score)} h-100`}
            >
              <div className="card-body text-center">
                <h5 className="card-title">Bias Score</h5>
                <h2 className={`text-${getBiasColor(result.bias_score)}`}>
                  {(result.bias_score * 100).toFixed(1)}%
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div
              className={`card border-${getPositiveColor(
                result.inclusivity_score
              )} h-100`}
            >
              <div className="card-body text-center">
                <h5 className="card-title">Inclusivity Score</h5>
                <h2
                  className={`text-${getPositiveColor(result.inclusivity_score)}`}
                >
                  {(result.inclusivity_score * 100).toFixed(1)}%
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div
              className={`card border-${getPositiveColor(
                result.clarity_score
              )} h-100`}
            >
              <div className="card-body text-center">
                <h5 className="card-title">Clarity Score</h5>
                <h2 className={`text-${getPositiveColor(result.clarity_score)}`}>
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
                  <i
                    className="bi bi-check-circle text-success fs-2"
                    
                  ></i>
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

          {/* Suggestions Section */}
          <div className="card mb-4">
            <div className="card-header bg-info text-dark">
              <h5 className="mb-0">Improvement Suggestions</h5>
            </div>
            <div className="card-body">
              {!result.suggestions || result.suggestions.length === 0 ? (
                <div className="text-center py-4">
                  <i
                    className="bi bi-lightbulb text-info fs-2"
                    
                  ></i>
                  <p className="lead mb-0 mt-2">
                    No suggestions needed! Your job description is well-written.
                  </p>
                </div>
              ) : (
                result.suggestions.map((suggestion: any, index: number) => (
                  <div key={index} className="mb-3 p-3 border-bottom">
                    <h6 className="text-primary mb-2">Original Text:</h6>
                    <p className="mb-3 bg-light p-2 rounded">
                      {suggestion.original}
                    </p>
                    <h6 className="text-success mb-2">Improved Version:</h6>
                    <p className="mb-3 bg-light p-2 rounded">
                      {suggestion.improved}
                    </p>
                    <p className="text-muted mb-0">
                      <small>
                        <strong>Rationale:</strong> {suggestion.rationale}
                      </small>
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

          {/* Download Button */}
          <div className="text-center mt-4 mb-5 no-print">
            <button onClick={handleDownload} className="btn btn-success btn-lg">
              <i className="bi bi-download me-2"></i>
              Download Analysis Report (PDF)
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Analysis;