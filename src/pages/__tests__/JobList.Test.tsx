import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test-utils'
import JobList from '../Joblist'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const mockJobs = [
  {
    id: '1',
    title: 'Software Engineer',
    originalText: 'Looking for a software engineer...',
    improvedText: 'Looking for a software developer...',
    fileName: 'job1.txt',
    createdAt: '2024-01-15T10:30:00Z',
    analysis: {
      bias_score: 0.8,
      inclusivity_score: 0.9,
      clarity_score: 0.7
    }
  }
]

describe('JobList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.getItem = vi.fn().mockReturnValue('user@example.com')
  })

  it('shows loading state initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {}))
    
    render(<JobList />)
    
    expect(screen.getByText(/loading your job listings/i)).toBeInTheDocument()
  })

  it('displays job listings when data is loaded', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockJobs })
    
    render(<JobList />)
    
    await waitFor(() => {
      expect(screen.getByText(/your job listings/i)).toBeInTheDocument()
      expect(screen.getByText(/job1.txt/i)).toBeInTheDocument()
      expect(screen.getByText(/bias score: 0.8/i)).toBeInTheDocument()
    })
  })

  it('shows empty state when no jobs', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] })
    
    render(<JobList />)
    
    await waitFor(() => {
      expect(screen.getByText(/no job listings found/i)).toBeInTheDocument()
      expect(screen.getByText(/analyze new job listing/i)).toBeInTheDocument()
    })
  })

  it('shows error state on API failure', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'))
    
    render(<JobList />)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch job listings/i)).toBeInTheDocument()
    })
  })
})