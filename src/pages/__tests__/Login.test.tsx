import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';

// Simple mocks
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as object,
    useNavigate: () => vi.fn(),
  };
});

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
  },
}));

vi.mock('../utils/storage', () => ({
  StorageService: {
    setUserEmail: vi.fn(() => true),
  },
}));

vi.mock('../styles/Login.css', () => ({}));

// Helper to render with router
const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form elements', () => {
    renderLogin();
    
    expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('allows user to type in email input', () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email Address');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('shows error for empty email submission', async () => {
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: 'Login' });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
  });

  it('shows error for invalid email format', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email Address');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
  });

  it('shows loading state when form is submitted', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email Address');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Logging in...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('disables input and button during loading', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email Address');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    expect(emailInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('accepts valid email formats', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email Address');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    
    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.click(submitButton);
    
    // Should not show validation error
    await waitFor(() => {
      expect(screen.queryByText(/Please enter a valid email address/i)).not.toBeInTheDocument();
    });
  });

  it('shows spinner during loading', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email Address');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles form submission without crashing', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email Address');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    // Should not throw error
    expect(() => {
      fireEvent.click(submitButton);
    }).not.toThrow();
  });

  it('clears error when valid email is entered', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email Address');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    
    // First trigger error
    fireEvent.click(submitButton);
    expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
    
    // Then enter valid email
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } });
    fireEvent.click(submitButton);
    
    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/Please enter a valid email address/i)).not.toBeInTheDocument();
    });
  });

  it('has correct input attributes', () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email Address');
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('placeholder', 'Enter your email');
  });

  it('has correct form structure', () => {
    renderLogin();
    
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
    
    const submitButton = screen.getByRole('button', { name: 'Login' });
    expect(submitButton).toHaveAttribute('type', 'submit');
  });
});