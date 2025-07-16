
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

// Mock API endpoints
vi.mock('../../utils/api', () => ({
  API_ENDPOINTS: {
    jobs: {
      analyze: 'http://localhost:5268/api/jobs/analyze',
      upload: 'http://localhost:5268/api/jobs/upload'
    }
  }
}))

// CHANGED: Mock useAuth hook instead of localStorage
let mockUserEmail: string | null = null
let mockIsLoading = false

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn().mockImplementation(() => ({
    userEmail: mockUserEmail,
    isLoading: mockIsLoading,
    logout: vi.fn()
  }))
}))

// Mock Redux hooks with proper state management
// Create a more flexible mock that can be accessed in tests
let mockResultData:any= null
let mockDispatchFn = vi.fn()

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux')
  return {
    ...(actual as object),
    useSelector: vi.fn().mockImplementation((selector) => {
      // Mock the root state structure
      const mockState = {
        result: {
          data: mockResultData
        }
      }
      return selector(mockState)
    }),
    useDispatch: vi.fn().mockImplementation(() => mockDispatchFn),
  }
})

// Mock store actions
vi.mock('../../store/resultSlice', () => ({
  setResult: vi.fn().mockImplementation((data) => ({ type: 'SET_RESULT', payload: data })),
  clearResult: vi.fn().mockReturnValue({ type: 'CLEAR_RESULT' }),
}))

// Mock LoginPrompt component
vi.mock('../../components/LoginPrompt', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="login-prompt">
      <h3>Login Required</h3>
      <p>Please log in to continue</p>
      <button onClick={onClose}>Close</button>
    </div>
  )
}))

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

describe('Home', () => {
  // Valid job description text that meets all validation requirements
  const validJobDescription = `
    We are seeking a skilled Software Developer to join our dynamic team. 
    The candidate will be responsible for developing and maintaining web applications.
    
    Requirements:
    - Bachelor's degree in Computer Science or related field
    - 3+ years of experience in software development
    - Proficiency in JavaScript, React, and Node.js
    - Strong problem-solving skills and attention to detail
    - Excellent communication and teamwork abilities
    
    Responsibilities:
    - Design and develop scalable web applications
    - Collaborate with cross-functional teams
    - Write clean, maintainable code
    - Participate in code reviews
    - Debug and troubleshoot applications
    
    This is a full-time position offering competitive salary and benefits.
  `.trim()

  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.clear()
    mockLocalStorage.getItem.mockReturnValue(null)
    mockResultData = null
    mockDispatchFn = vi.fn() // Reset the dispatch function for each test

    // Reset mock user email and loading state
    mockUserEmail = null
    mockIsLoading = false
  })

   // CHANGED: Add test for loading state
  it('shows loading state when auth is loading', () => {
    mockIsLoading = true
    
    render(<Home />)
    
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders home page correctly', () => {
    mockIsLoading = false
    render(<Home />)
    
    expect(screen.getByText(/jd analyzer/i)).toBeInTheDocument()
    expect(screen.getByText(/paste text/i)).toBeInTheDocument()
    expect(screen.getByText(/upload file/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/paste job description/i)).toBeInTheDocument()
  })

  it('switches between text and file input methods', () => {

    // CHANGED: Set user as not loading
    mockIsLoading = false
    render(<Home />)
    
    // Initially text input should be active
    expect(screen.getByPlaceholderText(/paste job description/i)).toBeInTheDocument()
    expect(screen.queryByText(/accepted file types/i)).not.toBeInTheDocument()
    
    // Click on upload file
    fireEvent.click(screen.getByText(/upload file/i))
    
    // File input should now be visible, text input should be gone
    expect(screen.getByText(/accepted file types/i)).toBeInTheDocument()
    expect(screen.queryByPlaceholderText(/paste job description/i)).not.toBeInTheDocument()
    
    // Switch back to text
    fireEvent.click(screen.getByText(/paste text/i))
    expect(screen.getByPlaceholderText(/paste job description/i)).toBeInTheDocument()
    expect(screen.queryByText(/accepted file types/i)).not.toBeInTheDocument()
  })

  it('shows login prompt when analyze is clicked without login', async () => {
    // CHANGED: Use auth mock instead of localStorage
    mockUserEmail = null
    mockIsLoading = false

    render(<Home />)

    // Add valid job description text to enable the analyze button
    const textArea = screen.getByPlaceholderText(/paste job description/i)
    fireEvent.change(textArea, {
      target: { value: validJobDescription }
    })

    // Wait for validation to complete
    await waitFor(() => {
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      expect(analyzeButton).not.toBeDisabled()
    })

    // Click analyze button
    const analyzeButton = screen.getByRole('button', { name: /analyze/i })
    fireEvent.click(analyzeButton)

    // Wait for LoginPrompt to show up
    await waitFor(() => {
      const loginPrompt = screen.getByTestId('login-prompt')
      expect(loginPrompt).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('submits text analysis when logged in', async () => {
    // CHANGED: Use auth mock instead of localStorage
    mockUserEmail = 'user@example.com'
    mockIsLoading = false
    
    // Mock successful API response
    mockedAxios.post.mockResolvedValue({ 
      data: { 
        analysis: 'success',
        improvedJD: 'Improved job description content'
      } 
    })
    
    render(<Home />)
    
    // Add valid job description text
    const textArea = screen.getByPlaceholderText(/paste job description/i)
    fireEvent.change(textArea, {
      target: { value: validJobDescription }
    })
    
    // Wait for validation to complete and button to be enabled
    await waitFor(() => {
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      expect(analyzeButton).not.toBeDisabled()
    })
    
    // Click analyze button
    const analyzeButton = screen.getByRole('button', { name: /analyze/i })
    fireEvent.click(analyzeButton)
    
    // Wait for API call to be made
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:5268/api/jobs/analyze',
        { 
          text: validJobDescription, 
          userEmail: 'user@example.com' 
        }
      )
    })
    
    // Verify navigation was called
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/analysis')
    })
  })

  it('disables analyze button when no input is provided', () => {
    render(<Home />)
    
    const analyzeButton = screen.getByRole('button', { name: /analyze/i })
    expect(analyzeButton).toBeDisabled()
    
    // Add valid text and button should be enabled
    const textArea = screen.getByPlaceholderText(/paste job description/i)
    fireEvent.change(textArea, {
      target: { value: validJobDescription }
    })
    
    // Wait for validation to complete
    waitFor(() => {
      expect(analyzeButton).not.toBeDisabled()
    })
  })

  it('disables analyze button when text validation fails', async () => {
    // CHANGED: Set user as not loading
    mockIsLoading = false
    render(<Home />)
    
    // Add invalid text (too short)
    const textArea = screen.getByPlaceholderText(/paste job description/i)
    fireEvent.change(textArea, {
      target: { value: 'Short text' }
    })
    
    // Wait for validation and check button is disabled
    await waitFor(() => {
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      expect(analyzeButton).toBeDisabled()
    })
    
    // Check that error message is shown
    await waitFor(() => {
      expect(screen.getByText(/must be at least 50 characters long/i)).toBeInTheDocument()
    })
  })

  it('shows error when API call fails', async () => {
    // CHANGED: Use auth mock instead of localStorage
    mockUserEmail = 'user@example.com'
    mockIsLoading = false
    
    // Mock API error
    const errorMessage = 'Analysis failed'
    mockedAxios.post.mockRejectedValue({
      response: { data: errorMessage }
    })
    
    // Import toast mock
    const { toast } = await import('react-toastify')
    
    render(<Home />)
    
    // Add valid job description text
    const textArea = screen.getByPlaceholderText(/paste job description/i)
    fireEvent.change(textArea, {
      target: { value: validJobDescription }
    })
    
    // Wait for validation to complete
    await waitFor(() => {
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      expect(analyzeButton).not.toBeDisabled()
    })
    
    // Click analyze button
    const analyzeButton = screen.getByRole('button', { name: /analyze/i })
    fireEvent.click(analyzeButton)
    
    // Wait for error to be shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
    })
  })

  it('handles file upload when logged in', async () => {
    // CHANGED: Use auth mock instead of localStorage
    mockUserEmail = 'user@example.com'
    mockIsLoading = false
    
    // Mock successful API response
    mockedAxios.post.mockResolvedValue({ 
      data: { 
        analysis: 'success',
        improvedJD: 'Improved job description content'
      } 
    })
    
    render(<Home />)
    
    // Switch to file upload mode
    fireEvent.click(screen.getByText(/upload file/i))
    
    // Verify file input is now visible
    expect(screen.getByText(/accepted file types/i)).toBeInTheDocument()
    
    // Create a mock file
    const file = new File(['job description content'], 'test.txt', { type: 'text/plain' })
    
    // Then in the test:
    const fileInput = screen.getByTestId('file-input')

    
    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    // Wait for file to be selected and analyze button to be enabled
    await waitFor(() => {
      const analyzeButton = screen.getByRole('button', { name: /analyze/i })
      expect(analyzeButton).not.toBeDisabled()
    })
    
    // Click analyze button
    const analyzeButton = screen.getByRole('button', { name: /analyze/i })
    fireEvent.click(analyzeButton)
    
    // Wait for API call to be made
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:5268/api/jobs/upload',
        expect.any(FormData)
      )
    })
    
    // Verify navigation was called
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/analysis')
    })
  })

  //  Add test for auth loading state behavior
  it('does not show main content while auth is loading', () => {
    mockIsLoading = true
    mockUserEmail = null
    
    render(<Home />)
    
    // Should show loading spinner
    expect(screen.getByRole('status')).toBeInTheDocument()
    
    // Should not show main content
    expect(screen.queryByText(/jd analyzer/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/paste text/i)).not.toBeInTheDocument()
  })
})