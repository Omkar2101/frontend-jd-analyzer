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

// Mock Redux hooks
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux')
  return {
    ...(actual as object),
    useSelector: vi.fn().mockReturnValue(null), // Mock result.data as null initially
    useDispatch: vi.fn().mockReturnValue(vi.fn()),
  }
})

// Mock LoginPrompt component - try different import paths
vi.mock('../components/LoginPrompt', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="login-prompt">
      <h3>Login Required</h3>
      <p>Please log in to continue</p>
      <button onClick={onClose}>Close</button>
    </div>
  )
}))

// Alternative mock in case the path is different
vi.mock('../../components/LoginPrompt', () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="login-prompt-alt">
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
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.clear()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  it('renders home page correctly', () => {
    render(<Home />)
    
    expect(screen.getByText(/jd analyzer/i)).toBeInTheDocument()
    expect(screen.getByText(/paste text/i)).toBeInTheDocument()
    expect(screen.getByText(/upload file/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/paste job description/i)).toBeInTheDocument()
  })

  it('switches between text and file input methods', () => {
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
    // Ensure user is not logged in
    mockLocalStorage.getItem.mockReturnValue(null)

    render(<Home />)

    // Add some text to enable the analyze button
    const textArea = screen.getByPlaceholderText(/paste job description/i)
    fireEvent.change(textArea, {
      target: { value: 'Test job description' }
    })

    // Click analyze button
    const analyzeButton = screen.getByRole('button', { name: /analyze/i })
    expect(analyzeButton).not.toBeDisabled()
    fireEvent.click(analyzeButton)

    // Wait for LoginPrompt to show up - try multiple selectors
    await waitFor(
      () => {
        const loginPrompt = screen.queryByTestId('login-prompt')
        if (!loginPrompt) {
          // Also try to find by text content
          const loginText = screen.queryByText(/login required/i)
          if (loginText) {
            expect(loginText).toBeInTheDocument()
            return
          }
          throw new Error('Login prompt not found')
        }
        expect(loginPrompt).toBeInTheDocument()
      },
      { timeout: 3000 }
    )
  })

  it('submits text analysis when logged in', async () => {
    // Mock user being logged in
    mockLocalStorage.getItem.mockReturnValue('user@example.com')
    
    // Mock successful API response
    mockedAxios.post.mockResolvedValue({ 
      data: { 
        analysis: 'success',
        improvedJD: 'Improved job description content'
      } 
    })
    
    render(<Home />)
    
    // Add text to analyze
    const textArea = screen.getByPlaceholderText(/paste job description/i)
    fireEvent.change(textArea, {
      target: { value: 'Test job description' }
    })
    
    // Click analyze button
    const analyzeButton = screen.getByRole('button', { name: /analyze/i })
    fireEvent.click(analyzeButton)
    
    // Wait for API call to be made
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:5268/api/jobs/analyze',
        { 
          text: 'Test job description', 
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
    
    // Add text and button should be enabled
    const textArea = screen.getByPlaceholderText(/paste job description/i)
    fireEvent.change(textArea, {
      target: { value: 'Test job description' }
    })
    
    expect(analyzeButton).not.toBeDisabled()
  })

  // it('handles file upload when logged in', async () => {
  //   // Mock user being logged in
  //   mockLocalStorage.getItem.mockReturnValue('user@example.com')
    
  //   // Mock successful API response
  //   mockedAxios.post.mockResolvedValue({ 
  //     data: { 
  //       analysis: 'success',
  //       improvedJD: 'Improved job description content'
  //     } 
  //   })
    
  //   render(<Home />)
    
  //   // Switch to file upload mode
  //   fireEvent.click(screen.getByText(/upload file/i))
    
  //   // Verify file input is now visible
  //   expect(screen.getByText(/accepted file types/i)).toBeInTheDocument()
    
  //   // Create a mock file
  //   const file = new File(['job description content'], 'test.txt', { type: 'text/plain' })
    
  //   // Find the file input by type attribute
  //   const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  //   expect(fileInput).toBeInTheDocument()
    
  //   // Mock the files property and trigger change event
  //   Object.defineProperty(fileInput, 'files', {
  //     value: [file],
  //     writable: false,
  //   })
    
  //   // Dispatch change event
  //   fireEvent.change(fileInput, { target: { files: [file] } })
    
  //   // Click analyze button
  //   const analyzeButton = screen.getByRole('button', { name: /analyze/i })
  //   expect(analyzeButton).not.toBeDisabled()
  //   fireEvent.click(analyzeButton)
    
  //   // Wait for API call to be made
  //   await waitFor(() => {
  //     expect(mockedAxios.post).toHaveBeenCalledWith(
  //       'http://localhost:5268/api/jobs/upload',
  //       expect.any(FormData)
  //     )
  //   })
    
  //   // Verify navigation was called
  //   await waitFor(() => {
  //     expect(mockNavigate).toHaveBeenCalledWith('/analysis')
  //   })
  // })

  it('shows error when API call fails', async () => {
    // Mock user being logged in
    mockLocalStorage.getItem.mockReturnValue('user@example.com')
    
    // Mock API error
    const errorMessage = 'Analysis failed'
    mockedAxios.post.mockRejectedValue({
      response: { data: errorMessage }
    })
    
    // Import toast mock
    const { toast } = await import('react-toastify')
    
    render(<Home />)
    
    // Add text to analyze
    const textArea = screen.getByPlaceholderText(/paste job description/i)
    fireEvent.change(textArea, {
      target: { value: 'Test job description' }
    })
    
    // Click analyze button
    const analyzeButton = screen.getByRole('button', { name: /analyze/i })
    fireEvent.click(analyzeButton)
    
    // Wait for error to be shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
    })
  })
})