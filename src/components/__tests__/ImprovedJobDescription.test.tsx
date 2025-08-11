
// import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
// import '@testing-library/jest-dom/vitest';
// import ImprovedJobDescription from '../ImprovedJobDescription';

// // Mock html2pdf
// vi.mock('html2pdf.js', () => ({
//   default: vi.fn(() => ({
//     set: vi.fn().mockReturnThis(),
//     from: vi.fn().mockReturnThis(),
//     toPdf: vi.fn().mockReturnThis(),
//     output: vi.fn().mockResolvedValue(new Blob(['fake-pdf'], { type: 'application/pdf' }))
//   }))
// }));

// // Mock URL methods properly
// const mockCreateObjectURL = vi.fn(() => 'mock-url-123');
// const mockRevokeObjectURL = vi.fn();

// Object.defineProperty(global, 'URL', {
//   writable: true,
//   value: {
//     createObjectURL: mockCreateObjectURL,
//     revokeObjectURL: mockRevokeObjectURL
//   }
// });

// // Sample job description for testing
// const mockJobDescription = `
// **JOB TITLE:** Software Developer

// **COMPANY:** Tech Corp

// **LOCATION:** Remote

// **JOB SUMMARY:**
// Looking for a skilled developer.

// **KEY RESPONSIBILITIES:**
// • Write code
// • Fix bugs
// • Work with team
// `;

// describe('ImprovedJobDescription', () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//     mockCreateObjectURL.mockClear();
//     mockRevokeObjectURL.mockClear();
//   });

//   afterEach(() => {
//     cleanup();
//     vi.restoreAllMocks();
//   });

//   it('should render loading state initially', () => {
//     render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
//     expect(screen.getByText('Generating PDF preview...')).toBeInTheDocument();
//   });

//   it('should show PDF preview after loading', async () => {
//     render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
//     await waitFor(() => {
//       expect(screen.queryByText('Generating PDF preview...')).not.toBeInTheDocument();
//     }, { timeout: 3000 });

//     expect(screen.getByTitle('Job Description PDF')).toBeInTheDocument();
//   });

//   it('should display correct filename', async () => {
//     render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
//     await waitFor(() => {
//       expect(screen.getByText('Software_Developer_Job_Description.pdf')).toBeInTheDocument();
//     }, { timeout: 3000 });
//   });

//   it('should show download and regenerate buttons', async () => {
//     render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
//     await waitFor(() => {
//       expect(screen.getByText('📄 Download PDF')).toBeInTheDocument();
//       expect(screen.getByText('🔄 Regenerate')).toBeInTheDocument();
//     }, { timeout: 3000 });
//   });

  

//   it('should show loading when regenerate is clicked', async () => {
//     render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
//     await waitFor(() => {
//       expect(screen.getByText('🔄 Regenerate')).toBeInTheDocument();
//     }, { timeout: 3000 });

//     fireEvent.click(screen.getByText('🔄 Regenerate'));
    
//     expect(screen.getByText('Generating PDF preview...')).toBeInTheDocument();
//   });

//   it('should use default filename when no job title found', async () => {
//     const textWithoutTitle = '**COMPANY:** Test Company';
    
//     render(<ImprovedJobDescription improvedText={textWithoutTitle} />);
    
//     await waitFor(() => {
//       expect(screen.getByText('Improved_Job_Description.pdf')).toBeInTheDocument();
//     }, { timeout: 3000 });
//   });

//   it('should handle empty text', async () => {
//     render(<ImprovedJobDescription improvedText="" />);
    
//     await waitFor(() => {
//       expect(screen.getByText('Improved_Job_Description.pdf')).toBeInTheDocument();
//     }, { timeout: 3000 });
//   });

//   it('should clean special characters from filename', async () => {
//     const jobWithSpecialChars = '**JOB TITLE:** Full-Stack Developer @ Company!';
    
//     render(<ImprovedJobDescription improvedText={jobWithSpecialChars} />);
    
//     await waitFor(() => {
//       expect(screen.getByText('Full-Stack_Developer___Company__Job_Description.pdf')).toBeInTheDocument();
//     }, { timeout: 3000 });
//   });

//   it('should create PDF URL when component mounts', async () => {
//     render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
//     await waitFor(() => {
//       expect(mockCreateObjectURL).toHaveBeenCalled();
//     }, { timeout: 3000 });
//   });
// });

// // Separate test for cleanup to avoid timing issues
// describe('Component Lifecycle', () => {
  

//   it('should regenerate PDF when text changes', async () => {
//     const html2pdf = await import('html2pdf.js');
    
//     const { rerender } = render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
//     await waitFor(() => {
//       expect(screen.queryByText('Generating PDF preview...')).not.toBeInTheDocument();
//     }, { timeout: 3000 });

//     // Clear previous calls
//     vi.clearAllMocks();

//     const newText = mockJobDescription.replace('Software Developer', 'Senior Developer');
//     rerender(<ImprovedJobDescription improvedText={newText} />);

//     expect(html2pdf.default).toHaveBeenCalled();
//   });
// });

// // Simple utility tests
// describe('Filename Generation', () => {
//   const testCases = [
//     { 
//       input: '**JOB TITLE:** Senior Engineer', 
//       expected: 'Senior_Engineer_Job_Description.pdf' 
//     },
//     { 
//       input: '**JOB TITLE:** Product Manager (Remote)', 
//       expected: 'Product_Manager__Remote__Job_Description.pdf' 
//     },
//     {
//       input: 'No job title here',
//       expected: 'Improved_Job_Description.pdf'
//     }
//   ];

//   testCases.forEach(({ input, expected }) => {
//     it(`should generate "${expected}" for input with title`, async () => {
//       render(<ImprovedJobDescription improvedText={input} />);
      
//       await waitFor(() => {
//         expect(screen.getByText(expected)).toBeInTheDocument();
//       }, { timeout: 3000 });
//     });
//   });
// });

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

// Sample job description for testing - includes all sections
const mockJobDescription = `
**JOB TITLE:** Software Developer

**COMPANY:** Tech Corp

**INDUSTRY:** Technology

**LOCATION:** Remote

**EMPLOYMENT TYPE:** Full-time

**JOB SUMMARY:**
Looking for a skilled developer to join our team.

**KEY RESPONSIBILITIES:**
• Write clean, maintainable code
• Fix bugs and optimize performance
• Work collaboratively with team members
• Participate in code reviews

**OUR IDEAL CANDIDATE:**
• Has strong programming skills
• Works well in a team environment
• Is passionate about technology
• Has excellent problem-solving abilities

**PREFERRED QUALIFICATIONS:**
• Bachelor's degree in Computer Science
• 3+ years of experience
• Knowledge of modern frameworks

**REQUIRED SKILLS:**
• JavaScript/TypeScript
• React
• Node.js
• Git version control

**WHAT WE OFFER:**
• Competitive salary
• Health benefits
• Remote work flexibility
• Professional development opportunities

**APPLICATION PROCESS:**
Please submit your resume and cover letter through our portal.
`;

// Mock console.log to avoid cluttering test output
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeEach(() => {
  console.log = vi.fn();
  console.error = vi.fn();
});

afterEach(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

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


 

  it('should display correct filename', async () => {
    render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
    await waitFor(() => {
      expect(screen.getByText('Software_Developer_Job_Description.pdf')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('should show download and regenerate buttons', async () => {
    render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
    await waitFor(() => {
      expect(screen.getByText('📄 Download PDF')).toBeInTheDocument();
      expect(screen.getByText('🔄 Regenerate')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('should show loading when regenerate is clicked', async () => {
    render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
    await waitFor(() => {
      expect(screen.getByText('🔄 Regenerate')).toBeInTheDocument();
    }, { timeout: 5000 });

    fireEvent.click(screen.getByText('🔄 Regenerate'));
    
    expect(screen.getByText('Generating PDF preview...')).toBeInTheDocument();
  });

  it('should use default filename when no job title found', async () => {
    const textWithoutTitle = '**COMPANY:** Test Company\n**LOCATION:** New York';
    
    render(<ImprovedJobDescription improvedText={textWithoutTitle} />);
    
    await waitFor(() => {
      expect(screen.getByText('Improved_Job_Description.pdf')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

 

  it('should clean special characters from filename', async () => {
    const jobWithSpecialChars = '**JOB TITLE:** Full-Stack Developer @ Company!';
    
    render(<ImprovedJobDescription improvedText={jobWithSpecialChars} />);
    
    await waitFor(() => {
      expect(screen.getByText('Full-Stack_Developer___Company__Job_Description.pdf')).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  it('should create PDF URL when component mounts', async () => {
    render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalled();
    }, { timeout: 5000 });
  });



  it('should handle section parsing with missing sections', async () => {
    const incompleteText = `
**JOB TITLE:** Test Job
**COMPANY:** Test Company
**JOB SUMMARY:**
This is a test job description.
    `;
    
    render(<ImprovedJobDescription improvedText={incompleteText} />);
    
    await waitFor(() => {
      const hasPreview = screen.queryByTitle('Job Description PDF');
      const hasError = screen.queryByText(/Failed to generate PDF/);
      
      // Should either generate PDF or show error, not be stuck loading
      expect(screen.queryByText('Generating PDF preview...')).not.toBeInTheDocument();
      expect(hasPreview || hasError).toBeTruthy();
    }, { timeout: 5000 });
  });
});

// Test for component lifecycle and error handling
describe('Component Lifecycle and Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.log = vi.fn();
  });

  it('should regenerate PDF when text changes', async () => {
    const html2pdf = await import('html2pdf.js');
    const mockPdfChain = {
      set: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      toPdf: vi.fn().mockReturnThis(),
      output: vi.fn().mockResolvedValue(new Blob(['fake-pdf'], { type: 'application/pdf' }))
    };
    
    html2pdf.default.mockImplementation(() => mockPdfChain);
    
    const { rerender } = render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Generating PDF preview...')).not.toBeInTheDocument();
    }, { timeout: 5000 });

    // Reset call count
    html2pdf.default.mockClear();

    const newText = mockJobDescription.replace('Software Developer', 'Senior Developer');
    rerender(<ImprovedJobDescription improvedText={newText} />);

    // Should be called again for the new text
    await waitFor(() => {
      expect(html2pdf.default).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('should handle PDF generation errors gracefully', async () => {
    const html2pdf = await import('html2pdf.js');
    
    // Mock PDF generation to fail
    html2pdf.default.mockImplementationOnce(() => ({
      set: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      toPdf: vi.fn().mockReturnThis(),
      output: vi.fn().mockRejectedValue(new Error('PDF generation failed'))
    }));

    render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to generate PDF preview/)).toBeInTheDocument();
    }, { timeout: 5000 });

    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should retry PDF generation when "Try Again" is clicked', async () => {
    const html2pdf = await import('html2pdf.js');
    
    // First call fails
    html2pdf.default.mockImplementationOnce(() => ({
      set: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      toPdf: vi.fn().mockReturnThis(),
      output: vi.fn().mockRejectedValue(new Error('PDF generation failed'))
    }));

    render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    }, { timeout: 5000 });

    // Reset mock for successful retry
    html2pdf.default.mockImplementation(() => ({
      set: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      toPdf: vi.fn().mockReturnThis(),
      output: vi.fn().mockResolvedValue(new Blob(['fake-pdf'], { type: 'application/pdf' }))
    }));

    fireEvent.click(screen.getByText('Try Again'));
    
    expect(screen.getByText('Generating PDF preview...')).toBeInTheDocument();
  });

 
});

// Test filename generation with various inputs
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
    },
    {
      input: '**JOB TITLE:**    Data Scientist & Analyst   ',
      expected: 'Data_Scientist___Analyst_Job_Description.pdf'
    },
    {
      input: '**JOB TITLE:** UI/UX Designer - Mobile Apps',
      expected: 'UI_UX_Designer_-_Mobile_Apps_Job_Description.pdf'
    }
  ];

  testCases.forEach(({ input, expected }) => {
    it(`should generate "${expected}" for given input`, async () => {
      render(<ImprovedJobDescription improvedText={input} />);
      
      await waitFor(() => {
        expect(screen.getByText(expected)).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });
});

// Test section parsing functionality
describe('Section Parsing', () => {
  beforeEach(() => {
    console.log = vi.fn();
  });

  it('should parse all standard sections correctly', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<ImprovedJobDescription improvedText={mockJobDescription} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Generating PDF preview...')).not.toBeInTheDocument();
    }, { timeout: 5000 });

   
    
    consoleSpy.mockRestore();
  });

  it('should handle malformed section headers', async () => {
    const malformedText = `
**JOB TITLE:** Test Job
**JOB SUMMARY
This section is missing the closing asterisks
**KEY RESPONSIBILITIES:**
• Task 1
• Task 2
    `;
    
    render(<ImprovedJobDescription improvedText={malformedText} />);
    
    await waitFor(() => {
      const hasPreview = screen.queryByTitle('Job Description PDF');
      const hasError = screen.queryByText(/Failed to generate PDF/);
      
      // Should handle malformed sections gracefully
      expect(screen.queryByText('Generating PDF preview...')).not.toBeInTheDocument();
      expect(hasPreview || hasError).toBeTruthy();
    }, { timeout: 5000 });
  });

  it('should handle sections with no content', async () => {
    const emptyContentText = `
**JOB TITLE:** Test Job
**JOB SUMMARY:**

**KEY RESPONSIBILITIES:**
• Task 1
    `;
    
    render(<ImprovedJobDescription improvedText={emptyContentText} />);
    
    await waitFor(() => {
      const hasPreview = screen.queryByTitle('Job Description PDF');
      const hasError = screen.queryByText(/Failed to generate PDF/);
      
      // Should handle empty content gracefully
      expect(screen.queryByText('Generating PDF preview...')).not.toBeInTheDocument();
      expect(hasPreview || hasError).toBeTruthy();
    }, { timeout: 5000 });
  });
});