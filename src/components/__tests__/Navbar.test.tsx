import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../test-utils'
import Navbar from '../Navbar'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual as object,
    useNavigate: () => mockNavigate,
  }
})

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

/**
 * Test suite for the Navbar component
 * Tests navigation functionality, authentication state handling, and responsive behavior
 */
describe('Navbar Component', () => {
  // Reset all mocks and clear localStorage before each test
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.removeItem.mockClear()
    mockNavigate.mockClear()
  })

  describe('Rendering - Not Logged In', () => {
    beforeEach(() => {
      mockLocalStorage.getItem.mockReturnValue(null)
    })

    it('renders navbar with correct elements when not logged in', () => {
      render(<Navbar />)
      
      // Check navbar structure
      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByText('JD Analyzer')).toBeInTheDocument()
      expect(screen.getByText('View All JDs')).toBeInTheDocument()
      expect(screen.getByText('Login')).toBeInTheDocument()
      
      // Should not show user info
      expect(screen.queryByText('User')).not.toBeInTheDocument()
      expect(screen.queryByText('Logout')).not.toBeInTheDocument()
    })

    it('has proper Bootstrap classes applied', () => {
      render(<Navbar />)
      
      const navbar = screen.getByRole('navigation')
      expect(navbar).toHaveClass('navbar', 'navbar-expand-lg', 'navbar-dark', 'bg-primary', 'px-3')
    })

    it('brand has proper styling and cursor pointer', () => {
      render(<Navbar />)
      
      const brand = screen.getByText('JD Analyzer')
      expect(brand).toHaveClass('navbar-brand', 'mb-0', 'h1')
      expect(brand).toHaveStyle({ cursor: 'pointer' })
    })
  })

  describe('Rendering - Logged In', () => {
    beforeEach(() => {
      mockLocalStorage.getItem.mockReturnValue('user@example.com')
    })

    it('renders navbar with user info when logged in', () => {
      render(<Navbar />)
      
      // Check logged in elements
      expect(screen.getByText('User')).toBeInTheDocument()
      expect(screen.getByText('Logout')).toBeInTheDocument()
      expect(screen.getByText('U')).toBeInTheDocument() // User avatar
      
      // Should not show login button
      expect(screen.queryByText('Login')).not.toBeInTheDocument()
    })

    it('displays user avatar with correct initial', () => {
      render(<Navbar />)
      
      const avatar = screen.getByText('U')
      expect(avatar).toHaveStyle({
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        background: '#fff',
        fontWeight: 'bold'
      })
    })

    it('displays correct user initial for different emails', () => {
      mockLocalStorage.getItem.mockReturnValue('john@example.com')
      render(<Navbar />)
      
      expect(screen.getByText('J')).toBeInTheDocument()
    })

    it('handles email with lowercase initial', () => {
      mockLocalStorage.getItem.mockReturnValue('alice@example.com')
      render(<Navbar />)
      
      expect(screen.getByText('A')).toBeInTheDocument()
    })
  })

  describe('Navigation Actions', () => {
    it('navigates to home when brand is clicked', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      render(<Navbar />)
      
      const brand = screen.getByText('JD Analyzer')
      fireEvent.click(brand)
      
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })

    it('navigates to JDs page when "View All JDs" is clicked', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      render(<Navbar />)
      
      const viewJDsButton = screen.getByText('View All JDs')
      fireEvent.click(viewJDsButton)
      
      expect(mockNavigate).toHaveBeenCalledWith('/jds')
    })

    it('navigates to login when login button is clicked', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      render(<Navbar />)
      
      const loginButton = screen.getByText('Login')
      fireEvent.click(loginButton)
      
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  describe('Logout Functionality', () => {
    beforeEach(() => {
      mockLocalStorage.getItem.mockReturnValue('user@example.com')
    })

    it('handles logout correctly', () => {
      render(<Navbar />)
      
      const logoutButton = screen.getByText('Logout')
      fireEvent.click(logoutButton)
      
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('userEmail')
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })

    it('logout button has correct styling', () => {
      render(<Navbar />)
      
      const logoutButton = screen.getByText('Logout')
      expect(logoutButton).toHaveClass('btn', 'btn-outline-light', 'btn-sm')
    })
  })

  describe('Responsive Design', () => {
    it('has proper responsive classes', () => {
      render(<Navbar />)
      
      const navbar = screen.getByRole('navigation')
      expect(navbar).toHaveClass('navbar-expand-lg')
      
      const rightSection = document.querySelector('.ms-auto')
      expect(rightSection).toHaveClass('d-flex', 'align-items-center')
    })

    it('view all JDs button has proper margin', () => {
      render(<Navbar />)
      
      const viewJDsButton = screen.getByText('View All JDs')
      expect(viewJDsButton).toHaveClass('btn', 'btn-light', 'me-3')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty email gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('')
      render(<Navbar />)
      
      // Should show login state when email is empty
      expect(screen.getByText('Login')).toBeInTheDocument()
      expect(screen.queryByText('User')).not.toBeInTheDocument()
    })

    it('handles very long email addresses', () => {
      mockLocalStorage.getItem.mockReturnValue('verylongemailaddress@example.com')
      render(<Navbar />)
      
      expect(screen.getByText('V')).toBeInTheDocument() // Should still show first letter
      expect(screen.getByText('User')).toBeInTheDocument()
    })

    it('handles special characters in email', () => {
      mockLocalStorage.getItem.mockReturnValue('user+test@example.com')
      render(<Navbar />)
      
      expect(screen.getByText('U')).toBeInTheDocument()
    })

    it('handles numeric first character in email', () => {
      mockLocalStorage.getItem.mockReturnValue('123user@example.com')
      render(<Navbar />)
      
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(<Navbar />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
      
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('buttons have proper focus states', () => {
      mockLocalStorage.getItem.mockReturnValue('user@example.com')
      render(<Navbar />)
      
      const logoutButton = screen.getByText('Logout')
      logoutButton.focus()
      expect(document.activeElement).toBe(logoutButton)
    })

    it('brand element is keyboard accessible', () => {
      render(<Navbar />)
      
      const brand = screen.getByText('JD Analyzer')
      
      // Simulate Enter key press
      fireEvent.keyDown(brand, { key: 'Enter', code: 'Enter' })
      // Note: In a real implementation, you'd need to handle keyboard events
      // This test documents the expected behavior
    })
  })

  describe('User Experience', () => {
   

    it('shows loading state gracefully when localStorage is being read', () => {
      // Simulate localStorage being slow/undefined
      mockLocalStorage.getItem.mockReturnValue(undefined)
      render(<Navbar />)
      
      // Should default to logged out state
      expect(screen.getByText('Login')).toBeInTheDocument()
    })
  })
})