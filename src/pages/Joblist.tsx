

// export default JobList
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { API_ENDPOINTS } from '../utils/api'
import { useAuth } from '../hooks/useAuth'

interface Job {
  id: string
  title: string
  originalText: string
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
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { userEmail, isLoading } = useAuth()

  // Helper to get badge class based on score and type
  // Helper to get badge class based on score and type
const getBadgeClass = (score: number, scoreType: 'bias' | 'inclusivity' | 'clarity'): string => {
  // Convert to percentage if score is in decimal format (0-1)
  const percentageScore = score <= 1 ? score * 100 : score;
  
  if (scoreType === 'bias') {
    // For bias: lower is better
    if (percentageScore < 60) return 'bg-success' // Green - good (low bias)
    if (percentageScore < 80) return 'bg-warning' // Yellow - medium
    return 'bg-danger' // Red - bad (high bias)
  } else {
    // For inclusivity and clarity: higher is better
    if (percentageScore < 60) return 'bg-danger' // Red - bad (low score)
    if (percentageScore < 80) return 'bg-warning' // Yellow - medium
    return 'bg-success' // Green - good (high score)
  }
}

  // Helper to parse possibly stringified JSON text
  const parseExtractedText = (text: string): string => {
    try {
      if (text.startsWith('{') && text.includes('extracted_text')) {
        const parsed = JSON.parse(text)
        return parsed.extracted_text || text
      }
      return text
    } catch {
      return text
    }
  }

  // Helper to truncate text neatly
  const truncateText = (text: string, maxLength: number = 150): string => {
    const cleanText = parseExtractedText(text)
    if (cleanText.length <= maxLength) return cleanText

    const truncated = cleanText.slice(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    if (lastSpace > maxLength * 0.8) {
      return truncated.slice(0, lastSpace) + '...'
    }
    return truncated + '...'
  }

  // Fetch job listings when auth is ready
  useEffect(() => {
    const fetchJobs = async () => {
      if (!userEmail) {
        setError('Please log in to view your job listings')
        return
      }

      try {
        setError(null)
        const response = await axios.get(API_ENDPOINTS.jobs.getByEmail(userEmail))

        const processedJobs = response.data.map((job: Job) => ({
          ...job,
          originalText: parseExtractedText(job.originalText),
          // improvedText: parseExtractedText(job.improvedText),
        }))

        setJobs(processedJobs)
      } catch (err) {
        setError('Failed to fetch job listings')
        toast.error('Error loading job listings')
        console.error(err)
      }
    }

    // Only trigger fetch if auth check has finished
    if (!isLoading) {
      fetchJobs()
    }
  }, [userEmail, isLoading])

  // === Loading State ===
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

  // === Error State ===
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        {!userEmail && (
          <div className="text-center mt-4">
            <Link to="/" className="btn btn-primary">Go to Home</Link>
          </div>
        )}
      </div>
    )
  }

  // === Empty State ===
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
            Analyze New Job 
          </Link>
        </div>
      </div>
    )
  }

  // === Delete Job Handler ===
  const handleDelete = async (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this job description?')) return

    try {
      await axios.delete(API_ENDPOINTS.jobs.deleteById(jobId))
      setJobs((prev) => prev.filter((job) => job.id !== jobId))
      toast.success('Job deleted successfully')
    } catch (err) {
      toast.error('Failed to delete job')
      console.error(err)
    }
  }

  // === Main UI ===
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
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                  </svg>
                </span>
              </button>

              <div className="card-body">
                <h5 className="card-title">{job.fileName || 'Untitled Job'}</h5>

                {/* Analysis Scores */}
                {job.analysis && (
                  <div className="mb-3">
                    <div className="d-flex gap-2 flex-wrap">
                      <span className={`badge ${getBadgeClass(job.analysis.bias_score, 'bias')}`}>
                        Bias: {100*(job.analysis.bias_score)}%
                      </span>
                      <span className={`badge ${getBadgeClass(job.analysis.inclusivity_score, 'inclusivity')}`}>
                        Inclusivity: {100*(job.analysis.inclusivity_score)}%
                      </span>
                      <span className={`badge ${getBadgeClass(job.analysis.clarity_score, 'clarity')}`}>
                        Clarity: {100*(job.analysis.clarity_score)}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Original Text */}
                <div className="mb-3">
                  <h6 className="text-muted mb-2">Original Text:</h6>
                  <div className="text-preview bg-light p-2 rounded">
                    <p className="card-text mb-0 text-muted small">
                      {truncateText(job.originalText, 120)}
                    </p>
                  </div>
                </div>

                {/* View Prompt */}
                <div className="text-center mt-3">
                  <small className="text-muted">
                    <i className="fas fa-eye me-1"></i>Click to view full analysis
                  </small>
                </div>
              </div>

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

