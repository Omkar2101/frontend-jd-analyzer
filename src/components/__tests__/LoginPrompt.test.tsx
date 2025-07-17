import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../test-utils'
import LoginPrompt from '../LoginPrompt'
import '@testing-library/jest-dom'

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
 * This component shows a modal when users need to log in to access certain features
 */
describe('LoginPrompt Component', () => {
  const mockOnClose = vi.fn()

  // Reset all mocks before each test to ensure clean state
  beforeEach(() => {
    mockOnClose.mockClear()
    mockNavigate.mockClear()
  })

  /**
   * Tests for component rendering and structure
   */
  describe('Rendering', () => {
    it('shows all required elements', () => {
      render(<LoginPrompt onClose={mockOnClose} />)
      
      // Check that main elements are visible
      expect(screen.getByText('Login Required')).toBeInTheDocument()
      expect(screen.getByText('You need to be logged in to analyze job descriptions.')).toBeInTheDocument()
      
      // Check that all buttons are present
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /go to login/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    })

    it('has proper modal structure with overlay', () => {
      render(<LoginPrompt onClose={mockOnClose} />)
      
      // Check modal overlay exists with correct class
      const overlay = document.querySelector('.login-prompt-overlay')
      expect(overlay).toBeInTheDocument()
      
      // Check modal content exists
      const content = document.querySelector('.login-prompt-content')
      expect(content).toBeInTheDocument()
    })

    it('has correct accessibility attributes', () => {
      render(<LoginPrompt onClose={mockOnClose} />)
      
      // Check modal dialog attributes
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby', 'login-prompt-title')
      
      // Check close button accessibility
      const closeButton = screen.getByRole('button', { name: /close/i })
      expect(closeButton).toHaveAttribute('aria-label', 'Close')
    })
  })

  /**
   * Tests for user interactions and button clicks
   */
  describe('User Interactions', () => {
    it('closes modal when X button is clicked', () => {
      render(<LoginPrompt onClose={mockOnClose} />)
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      fireEvent.click(closeButton)
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('closes modal when Cancel button is clicked', () => {
      render(<LoginPrompt onClose={mockOnClose} />)
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      fireEvent.click(cancelButton)
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('closes modal and navigates to login when "Go to Login" is clicked', () => {
      render(<LoginPrompt onClose={mockOnClose} />)
      
      const loginButton = screen.getByRole('button', { name: /go to login/i })
      fireEvent.click(loginButton)
      
      // Should close the modal first
      expect(mockOnClose).toHaveBeenCalledTimes(1)
      // Then navigate to login page
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    it('closes modal when clicking on the overlay background', () => {
      render(<LoginPrompt onClose={mockOnClose} />)
      
      const overlay = document.querySelector('.login-prompt-overlay')
      fireEvent.click(overlay!)
      
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })

    it('does NOT close modal when clicking on the modal content', () => {
      render(<LoginPrompt onClose={mockOnClose} />)
      
      const content = document.querySelector('.login-prompt-content')
      fireEvent.click(content!)
      
      // Should not close because we clicked inside the modal
      expect(mockOnClose).not.toHaveBeenCalled()
    })
  })

  /**
   * Tests for navigation behavior
   */
  describe('Navigation', () => {
    it('navigates to correct login route', () => {
      render(<LoginPrompt onClose={mockOnClose} />)
      
      const loginButton = screen.getByRole('button', { name: /go to login/i })
      fireEvent.click(loginButton)
      
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    it('calls onClose before navigating', () => {
      render(<LoginPrompt onClose={mockOnClose} />)
      
      const loginButton = screen.getByRole('button', { name: /go to login/i })
      fireEvent.click(loginButton)
      
      // Both functions should be called
      expect(mockOnClose).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalled()
    })
  })

  /**
   * Tests for component props
   */
  describe('Props', () => {
    it('calls the onClose function passed as prop', () => {
      const customOnClose = vi.fn()
      render(<LoginPrompt onClose={customOnClose} />)
      
      const closeButton = screen.getByRole('button', { name: /close/i })
      fireEvent.click(closeButton)
      
      expect(customOnClose).toHaveBeenCalledTimes(1)
    })
  })
})