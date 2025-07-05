import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../test-utils'
import LoginPrompt from '../LoginPrompt'
import '@testing-library/jest-dom';


// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual as object,
    useNavigate: () => mockNavigate,
  }
})

/**
 * Test suite for the LoginPrompt component
 * This component is shown when a user tries to perform actions that require authentication
 */
describe('LoginPrompt Component', () => {
  // Mock function to simulate the onClose callback
  const mockOnClose = vi.fn()

  // Reset all mocks before each test to ensure clean state
  beforeEach(() => {
    mockOnClose.mockClear()
    mockNavigate.mockClear()
  })
  /**
   * Tests related to the visual rendering and structure of the component
   */
  describe('Rendering', () => {
    /**
     * Test: Component Structure and Elements
     * Verifies that all required UI elements are present and properly structured:
     * - Modal overlay with correct styling
     * - Title and description text
     * - Navigation and close buttons
     */
    it('renders login prompt with correct elements', () => {
      render(<LoginPrompt onClose={mockOnClose} />)
      
      // Check modal overlay and its styling properties
      const modalOverlay = document.querySelector('.modal-overlay')
      expect(modalOverlay).toBeInTheDocument()
      expect(modalOverlay).toHaveStyle({
        position: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: '1000'
      })
      
      // Check main content
      expect(screen.getByText('Login Required')).toBeInTheDocument()
      expect(screen.getByText(/you need to be logged in to analyze/i)).toBeInTheDocument()
      
      // Check buttons
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /go to login/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    })

  

    it('has proper accessibility attributes', () => {
      render(<LoginPrompt onClose={mockOnClose} />)
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toHaveAttribute('aria-label', 'Close')
    })
  })

  describe('User Interactions', () => {
    it('calls onClose when close button (X) is clicked', () => {
      render(<LoginPrompt onClose={mockOnClose} />)
      
      const closeButton = screen.getByLabelText(/close/i)
      fireEvent.click(closeButton)
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when cancel button is clicked', () => {
      render(<LoginPrompt onClose={mockOnClose} />)
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

 

    it('calls onClose when clicking on modal overlay', () => {
      render(<LoginPrompt onClose={mockOnClose} />)
      
      const modalOverlay = document.querySelector('.modal-overlay')
      fireEvent.click(modalOverlay!)
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onClose when clicking on modal content', () => {
      render(<LoginPrompt onClose={mockOnClose} />)
      
      const modalContent = document.querySelector('.modal-content')
      fireEvent.click(modalContent!)
      
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  
})