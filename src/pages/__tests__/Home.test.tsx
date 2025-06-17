import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test-utils'
import Home from '../Home'
import axios from 'axios'

// Mock axios
vi.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...(actual as object),
    useNavigate: () => mockNavigate,
  }
})

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  }
}))

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders home page correctly', () => {
    render(<Home />)
    
    expect(screen.getByText(/jd analyzer/i)).toBeInTheDocument()
    expect(screen.getByText(/paste text/i)).toBeInTheDocument()
    expect(screen.getByText(/upload file/i)).toBeInTheDocument()
  })

  it('switches between text and file input methods', () => {
    render(<Home />)
    
    // Initially text input should be active
    expect(screen.getByPlaceholderText(/paste job description/i)).toBeInTheDocument()
    
    // Click on upload file
    fireEvent.click(screen.getByText(/upload file/i))
    
    // File input should now be visible
    expect(screen.getByText(/accepted file types/i)).toBeInTheDocument()
  })

it('shows login prompt when analyze is clicked without login', async () => {
  localStorage.getItem = vi.fn().mockReturnValue(null)

  render(<Home />)

  fireEvent.change(screen.getByPlaceholderText(/paste job description/i), {
    target: { value: 'Test job description' }
  })

  fireEvent.click(screen.getByText(/analyze/i))

  // ✅ wait for LoginPrompt to show up
  const loginModalTitle = await screen.findByText(/login required/i)
  expect(loginModalTitle).toBeInTheDocument()
})

  it('submits text analysis when logged in', async () => {
    localStorage.getItem = vi.fn().mockReturnValue('user@example.com')
    mockedAxios.post.mockResolvedValue({ data: { analysis: 'success' } })
    
    render(<Home />)
    
    fireEvent.change(screen.getByPlaceholderText(/paste job description/i), {
      target: { value: 'Test job description' }
    })
    
    fireEvent.click(screen.getByText(/analyze/i))
    
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:5268/api/jobs/analyze',
        { text: 'Test job description', userEmail: 'user@example.com' }
      )
    })
  })
})