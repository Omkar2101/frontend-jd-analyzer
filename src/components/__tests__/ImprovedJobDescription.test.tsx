
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import ImprovedJobDescription from '../ImprovedJobDescription';

// Mock html2pdf
vi.mock('html2pdf.js', () => ({
  default: vi.fn(() => ({
    set: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    toPdf: vi.fn().mockReturnThis(),
    output: vi.fn().mockResolvedValue(new Blob(['fake-pdf'], { type: 'application/pdf' }))
  }))
}));

// Mock URL methods properly
const mockCreateObjectURL = vi.fn(() => 'mock-url-123');
const mockRevokeObjectURL = vi.fn();

Object.defineProperty(global, 'URL', {
  writable: true,
  value: {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL
  }
});

// Sample job description for testing
const mockJobDescription = `
**JOB TITLE:** Software Developer

**COMPANY:** Tech Corp

**LOCATION:** Remote

**JOB SUMMARY:**
Looking for a skilled developer.

**KEY RESPONSIBILITIES:**
• Write code
• Fix bugs
• Work with team
`;

describe('ImprovedJobDescription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateObjectURL.mockClear();
    mockRevokeObjectURL.mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should render loading state initially', () => {
    render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
    expect(screen.getByText('Generating PDF preview...')).toBeInTheDocument();
  });

  it('should show PDF preview after loading', async () => {
    render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Generating PDF preview...')).not.toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByTitle('Job Description PDF')).toBeInTheDocument();
  });

  it('should display correct filename', async () => {
    render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
    await waitFor(() => {
      expect(screen.getByText('Software_Developer_Job_Description.pdf')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should show download and regenerate buttons', async () => {
    render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
    await waitFor(() => {
      expect(screen.getByText('📄 Download PDF')).toBeInTheDocument();
      expect(screen.getByText('🔄 Regenerate')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  

  it('should show loading when regenerate is clicked', async () => {
    render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
    await waitFor(() => {
      expect(screen.getByText('🔄 Regenerate')).toBeInTheDocument();
    }, { timeout: 3000 });

    fireEvent.click(screen.getByText('🔄 Regenerate'));
    
    expect(screen.getByText('Generating PDF preview...')).toBeInTheDocument();
  });

  it('should use default filename when no job title found', async () => {
    const textWithoutTitle = '**COMPANY:** Test Company';
    
    render(<ImprovedJobDescription improvedText={textWithoutTitle} />);
    
    await waitFor(() => {
      expect(screen.getByText('Improved_Job_Description.pdf')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should handle empty text', async () => {
    render(<ImprovedJobDescription improvedText="" />);
    
    await waitFor(() => {
      expect(screen.getByText('Improved_Job_Description.pdf')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should clean special characters from filename', async () => {
    const jobWithSpecialChars = '**JOB TITLE:** Full-Stack Developer @ Company!';
    
    render(<ImprovedJobDescription improvedText={jobWithSpecialChars} />);
    
    await waitFor(() => {
      expect(screen.getByText('Full-Stack_Developer___Company__Job_Description.pdf')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should create PDF URL when component mounts', async () => {
    render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalled();
    }, { timeout: 3000 });
  });
});

// Separate test for cleanup to avoid timing issues
describe('Component Lifecycle', () => {
  

  it('should regenerate PDF when text changes', async () => {
    const html2pdf = await import('html2pdf.js');
    
    const { rerender } = render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Generating PDF preview...')).not.toBeInTheDocument();
    }, { timeout: 3000 });

    // Clear previous calls
    vi.clearAllMocks();

    const newText = mockJobDescription.replace('Software Developer', 'Senior Developer');
    rerender(<ImprovedJobDescription improvedText={newText} />);

    expect(html2pdf.default).toHaveBeenCalled();
  });
});

// Simple utility tests
describe('Filename Generation', () => {
  const testCases = [
    { 
      input: '**JOB TITLE:** Senior Engineer', 
      expected: 'Senior_Engineer_Job_Description.pdf' 
    },
    { 
      input: '**JOB TITLE:** Product Manager (Remote)', 
      expected: 'Product_Manager__Remote__Job_Description.pdf' 
    },
    {
      input: 'No job title here',
      expected: 'Improved_Job_Description.pdf'
    }
  ];

  testCases.forEach(({ input, expected }) => {
    it(`should generate "${expected}" for input with title`, async () => {
      render(<ImprovedJobDescription improvedText={input} />);
      
      await waitFor(() => {
        expect(screen.getByText(expected)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });
});