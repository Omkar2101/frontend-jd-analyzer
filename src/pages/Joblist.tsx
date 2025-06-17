import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
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

  const email = localStorage.getItem('userEmail') || '';

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
        setJobs(response.data)
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
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{job.fileName || 'Untitled Job'}</h5>
                <div className="mb-3">
                  {job.analysis && (
                    <div className="d-flex gap-3 mb-3">
                      <span className="badge bg-info">
                        Bias Score: {(job.analysis.bias_score).toFixed(1)}
                      </span>
                      <span className="badge bg-success">
                        Inclusivity: {(job.analysis.inclusivity_score).toFixed(1)}
                      </span>
                      <span className="badge bg-primary">
                        Clarity: {(job.analysis.clarity_score).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <h6 className="text-muted">Original Text:</h6>
                  <p className="card-text">{job.originalText.slice(0, 150)}...</p>
                </div>
                <div>
                  <h6 className="text-muted">Improved Text:</h6>
                  <p className="card-text">{job.improvedText.slice(0, 150)}...</p>
                </div>
              </div>
              {job.createdAt && (
                <div className="card-footer text-muted">
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
