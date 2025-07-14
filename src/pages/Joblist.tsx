// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { Link, useNavigate } from 'react-router-dom'
// import { toast } from 'react-toastify'

// interface Job {
//   id: string
//   title: string
//   originalText: string
//   improvedText: string
//   fileName: string
//   createdAt?: string
//   analysis?: {
//     bias_score: number
//     inclusivity_score: number
//     clarity_score: number
//   }
// }

// const JobList: React.FC = () => {
//   const [jobs, setJobs] = useState<Job[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const navigate = useNavigate();

//   const email = localStorage.getItem('userEmail') || '';

//   useEffect(() => {
//     const fetchJobs = async () => {
//       if (!email) {
//         setError('Please log in to view your job listings')
//         setIsLoading(false)
//         return
//       }

//       try {
//         setIsLoading(true)
//         setError(null)
//         const response = await axios.get(`http://localhost:5268/api/jobs/user/${email}`)
//         setJobs(response.data)
//       } catch (err) {
//         setError('Failed to fetch job listings')
//         toast.error('Error loading job listings')
//         console.error(err)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchJobs()
//   }, [email])

//   if (isLoading) {
//     return (
//       <div className="container mt-5 text-center">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <p className="mt-3">Loading your job listings...</p>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="container mt-5">
//         <div className="alert alert-danger" role="alert">
//           {error}
//         </div>
//         {!email && (
//           <div className="text-center mt-4">
//             <Link to="/" className="btn btn-primary">Go to Home</Link>
//           </div>
//         )}
//       </div>
//     )
//   }

//   if (jobs.length === 0) {
//     return (
//       <div className="container mt-5">
//         <div className="text-center">
//           <img 
//             src="/idea.png" 
//             alt="No Jobs" 
//             style={{ width: '150px', marginBottom: '2rem', opacity: '0.7' }}
//           />
//           <h3>No Job Listings Found</h3>
//           <p className="text-muted mb-4">
//             You haven't analyzed any job listings yet. Start by uploading one!
//           </p>
//           <Link to="/" className="btn btn-primary">
//             Analyze New Job Listing
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   // Delete handler
//   const handleDelete = async (e: React.MouseEvent, jobId: string) => {
//     e.stopPropagation();
//     if (!window.confirm('Are you sure you want to delete this job description?')) return;
//     try {
//       await axios.delete(`http://localhost:5268/api/jobs/${jobId}`);
//       setJobs((prev) => prev.filter((job) => job.id !== jobId));
//       toast.success('Job deleted successfully');
//     } catch (err) {
//       toast.error('Failed to delete job');
//       console.error(err);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2>Your Job Listings</h2>
//         <Link to="/" className="btn btn-primary">
//           Analyze New Job
//         </Link>
//       </div>

//       <div className="row">
//         {jobs.map((job) => (
//           <div className="col-md-6 mb-4" key={job.id}>
//             <div
//               className="card h-100 shadow-sm position-relative"
//               style={{ cursor: 'pointer' }}
//               onClick={() => navigate(`/analysis/${job.id}`)}
//             >
//               {/* Delete button (top right corner) */}
//               <button
//                 className="btn btn-sm btn-danger position-absolute"
//                 style={{ top: 10, right: 10, zIndex: 2 }}
//                 title="Delete job"
//                 onClick={(e) => handleDelete(e, job.id)}
//               >
//                 <span aria-hidden="true">&times;</span>
//               </button>
//               <div className="card-body">
//                 <h5 className="card-title">{job.fileName || 'Untitled Job'}</h5>
//                 <div className="mb-3">
//                   {job.analysis && (
//                     <div className="d-flex gap-3 mb-3">
//                       <span className="badge bg-info">
//                         Bias Score: {(job.analysis.bias_score).toFixed(1)}
//                       </span>
//                       <span className="badge bg-success">
//                         Inclusivity: {(job.analysis.inclusivity_score).toFixed(1)}
//                       </span>
//                       <span className="badge bg-primary">
//                         Clarity: {(job.analysis.clarity_score).toFixed(1)}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//                 <div className="mb-3">
//                   <h6 className="text-muted">Original Text:</h6>
//                   <p className="card-text">{job.originalText.slice(0, 150)}...</p>
//                 </div>
//                 <div>
//                   <h6 className="text-muted">Improved Text:</h6>
//                   <p className="card-text">{job.improvedText.slice(0, 150)}...</p>
//                 </div>
//               </div>
//               {job.createdAt && (
//                 <div className="card-footer text-muted">
//                   Analyzed on {new Date(job.createdAt).toLocaleDateString()} at{' '}
//                   {new Date(job.createdAt).toLocaleTimeString()}
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

// export default JobList
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

interface Job {
  id: string
  title: string
  originalText: string
  improvedText: string
  fileName: string
  createdAt?: string
  analysis?: {
    bias_score: number
    inclusivity_score: number
    clarity_score: number
  }
}

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate();

  const email = localStorage.getItem('userEmail') || '';

  // Helper function to parse JSON response and extract text
  const parseExtractedText = (text: string): string => {
    try {
      // Check if the text is JSON
      if (text.startsWith('{') && text.includes('extracted_text')) {
        const parsed = JSON.parse(text);
        return parsed.extracted_text || text;
      }
      return text;
    } catch (error) {
      // If parsing fails, return original text
      return text;
    }
  };

  // Helper function to truncate text intelligently
  const truncateText = (text: string, maxLength: number = 150): string => {
    const cleanText = parseExtractedText(text);
    if (cleanText.length <= maxLength) return cleanText;
    
    // Try to cut at a word boundary
    const truncated = cleanText.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.8) {
      return truncated.slice(0, lastSpace) + '...';
    }
    
    return truncated + '...';
  };

  useEffect(() => {
    const fetchJobs = async () => {
      if (!email) {
        setError('Please log in to view your job listings')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const response = await axios.get(`http://localhost:5268/api/jobs/user/${email}`)
        
        // Process the jobs data to clean up the text fields
        const processedJobs = response.data.map((job: Job) => ({
          ...job,
          originalText: parseExtractedText(job.originalText),
          improvedText: parseExtractedText(job.improvedText)
        }));
        
        setJobs(processedJobs)
      } catch (err) {
        setError('Failed to fetch job listings')
        toast.error('Error loading job listings')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [email])

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your job listings...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        {!email && (
          <div className="text-center mt-4">
            <Link to="/" className="btn btn-primary">Go to Home</Link>
          </div>
        )}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <img 
            src="/idea.png" 
            alt="No Jobs" 
            style={{ width: '150px', marginBottom: '2rem', opacity: '0.7' }}
          />
          <h3>No Job Listings Found</h3>
          <p className="text-muted mb-4">
            You haven't analyzed any job listings yet. Start by uploading one!
          </p>
          <Link to="/" className="btn btn-primary">
            Analyze New Job Listing
          </Link>
        </div>
      </div>
    )
  }

  // Delete handler
  const handleDelete = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this job description?')) return;
    try {
      await axios.delete(`http://localhost:5268/api/jobs/${jobId}`);
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
      toast.success('Job deleted successfully');
    } catch (err) {
      toast.error('Failed to delete job');
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Job Listings</h2>
        <Link to="/" className="btn btn-primary">
          Analyze New Job
        </Link>
      </div>

      <div className="row">
        {jobs.map((job) => (
          <div className="col-md-6 mb-4" key={job.id}>
            <div
              className="card h-100 shadow-sm position-relative"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/analysis/${job.id}`)}
            >
              {/* Delete button (top right corner) */}
              <button
                className="btn btn-sm position-absolute"
                style={{ 
                  top: 10, 
                  right: 10, 
                  zIndex: 2,
                  backgroundColor: 'transparent',
                  border: '1px solid #dc3545',
                  color: '#dc3545',
                  transition: 'all 0.2s ease'
                }}
                title="Delete job"
                onClick={(e) => handleDelete(e, job.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc3545';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#dc3545';
                }}
              >
                <span aria-hidden="true">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                  </svg>
                </span>
              </button>
              <div className="card-body">
                <h5 className="card-title">{job.fileName || 'Untitled Job'}</h5>
                
                {/* Analysis scores */}
                {job.analysis && (
                  <div className="mb-3">
                    <div className="d-flex gap-2 flex-wrap">
                      <span className="badge bg-info">
                        Bias: {(job.analysis.bias_score).toFixed(1)}
                      </span>
                      <span className="badge bg-success">
                        Inclusivity: {(job.analysis.inclusivity_score).toFixed(1)}
                      </span>
                      <span className="badge bg-primary">
                        Clarity: {(job.analysis.clarity_score).toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Original Text Preview */}
                <div className="mb-3">
                  <h6 className="text-muted mb-2">
                    <i className="fas fa-file-alt me-1"></i>Original Text:
                  </h6>
                  <div className="text-preview bg-light p-2 rounded">
                    <p className="card-text mb-0 text-muted small">
                      {truncateText(job.originalText, 120)}
                    </p>
                  </div>
                </div>

                {/* Improved Text Preview */}
                <div className="mb-3">
                  <h6 className="text-success mb-2">
                    <i className="fas fa-check-circle me-1"></i>Improved Text:
                  </h6>
                  <div className="text-preview bg-light p-2 rounded border-start border-success border-3">
                    <p className="card-text mb-0 small">
                      {truncateText(job.improvedText, 120)}
                    </p>
                  </div>
                </div>

                {/* Click to view full analysis */}
                <div className="text-center mt-3">
                  <small className="text-muted">
                    <i className="fas fa-eye me-1"></i>Click to view full analysis
                  </small>
                </div>
              </div>
              
              {/* Card footer with timestamp */}
              {job.createdAt && (
                <div className="card-footer text-muted small">
                  <i className="fas fa-clock me-1"></i>
                  Analyzed on {new Date(job.createdAt).toLocaleDateString()} at{' '}
                  {new Date(job.createdAt).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default JobList