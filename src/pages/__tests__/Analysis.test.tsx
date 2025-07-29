

// import { describe, it, expect, vi, beforeEach } from 'vitest'
// import { render, screen, fireEvent } from '../../test-utils'
// import Analysis from '../Analysis'

// // Mock react-router-dom
// const mockNavigate = vi.fn()
// vi.mock('react-router-dom', async () => {
//   const actual = await vi.importActual('react-router-dom')
//   return {
//     ...(actual as object),
//     useNavigate: () => mockNavigate,
//     Link: ({ to, children, className }: any) => (
//       <a href={to} className={className}>
//         {children}
//       </a>
//     ),
//   }
// })

// // Mock react-toastify
// vi.mock('react-toastify', () => ({
//   toast: {
//     success: vi.fn(),
//     error: vi.fn(),
//   }
// }))

// // Mock html2pdf
// vi.mock('html2pdf.js', () => ({
//   default: vi.fn(() => ({
//     set: vi.fn(() => ({
//       from: vi.fn(() => ({
//         save: vi.fn(() => Promise.resolve())
//       }))
//     }))
//   }))
// }))

// // Mock components
// vi.mock('../../components/ImprovedJobDescription', () => ({
//   default: ({ improvedText }: { improvedText: string }) => (
//     <div data-testid="improved-job-description">
//       {improvedText}
//     </div>
//   )
// }))

// vi.mock('../../components/JobFileViewer', () => ({
//   default: ({ job }: { job: any }) => (
//     <div data-testid="job-file-viewer">
//       File: {job.originalFileName}
//     </div>
//   )
// }))

// // Mock API endpoints
// vi.mock('../../utils/api', () => ({
//   API_ENDPOINTS: {
//     files: {
//       viewFile: (fileName: string) => `http://localhost:5268/api/files/${fileName}/view`
//     }
//   }
// }))

// // Mock Redux - Fixed to include Provider and other exports
// let mockResultData: any = null

// vi.mock('react-redux', async () => {
//   const actual = await vi.importActual('react-redux')
//   return {
//     ...actual as object,
//     useSelector: vi.fn().mockImplementation(() => mockResultData),
//     // Include other commonly used exports that might be needed
//     useDispatch: vi.fn(() => vi.fn()),
//   }
// })

// describe('Analysis', () => {
//   beforeEach(() => {
//     vi.clearAllMocks()
//     mockResultData = null
//     mockNavigate.mockClear()
//   })

//   it('redirects to home when no result data', () => {
//     mockResultData = null
    
//     render(<Analysis />)
    
//     expect(mockNavigate).toHaveBeenCalledWith('/')
//   })

//   it('shows no analysis data message when result is null', () => {
//     mockResultData = null
    
//     render(<Analysis />)
    
//     expect(screen.getByText('No analysis data available')).toBeInTheDocument()
//     expect(screen.getByText('Analyze New Job Description')).toBeInTheDocument()
//   })

//   it('renders analysis with basic result data', () => {
//     mockResultData = {
//       fileName: 'test-job.txt',
//       bias_score: 0.3,
//       inclusivity_score: 0.8,
//       clarity_score: 0.7,
//       overall_assessment: 'This is a good job description'
//     }
    
//     render(<Analysis />)
    
//     expect(screen.getByText('Job Description Analysis')).toBeInTheDocument()
//     expect(screen.getByText('test-job.txt')).toBeInTheDocument()
//     expect(screen.getByText('Overall Assessment')).toBeInTheDocument()
//     expect(screen.getByText('This is a good job description')).toBeInTheDocument()
//   })

//   it('shows analysis matrix when scores are not all zero', () => {
//     mockResultData = {
//       bias_score: 0.3,
//       inclusivity_score: 0.8,
//       clarity_score: 0.7,
//       overall_assessment: 'Good job description'
//     }
    
//     render(<Analysis />)
    
//     expect(screen.getByText('📊 Analysis Matrix')).toBeInTheDocument()
//     expect(screen.getByText('Bias Level')).toBeInTheDocument()
//     expect(screen.getByText('Inclusivity Score')).toBeInTheDocument()
//     expect(screen.getByText('Clarity Score')).toBeInTheDocument()
//   })

//   it('hides analysis matrix when all scores are zero', () => {
//     mockResultData = {
//       bias_score: 0,
//       inclusivity_score: 0,
//       clarity_score: 0,
//       overall_assessment: 'Basic assessment'
//     }
    
//     render(<Analysis />)
    
//     expect(screen.queryByText('📊 Analysis Matrix')).not.toBeInTheDocument()
//     expect(screen.getByText('Overall Assessment')).toBeInTheDocument()
//   })

//   it('shows file viewer when file data exists', () => {
//     mockResultData = {
//       fileUrl: 'http://example.com/file.pdf',
//       originalFileName: 'job-description.pdf',
//       contentType: 'application/pdf',
//       fileSize: 1024,
//       bias_score: 0.3,
//       inclusivity_score: 0.8,
//       clarity_score: 0.7
//     }
    
//     render(<Analysis />)
    
//     expect(screen.getByText('📎 Uploaded File')).toBeInTheDocument()
//     expect(screen.getByTestId('job-file-viewer')).toBeInTheDocument()
//   })

//   it('shows job role and industry when scores are not zero', () => {
//     mockResultData = {
//       role: 'Software Developer',
//       industry: 'Technology',
//       bias_score: 0.3,
//       inclusivity_score: 0.8,
//       clarity_score: 0.7
//     }
    
//     render(<Analysis />)
    
//     expect(screen.getByText('Job Role')).toBeInTheDocument()
//     expect(screen.getByText('Software Developer')).toBeInTheDocument()
//     expect(screen.getByText('Job Industry')).toBeInTheDocument()
//     expect(screen.getByText('Technology')).toBeInTheDocument()
//   })

//   it('shows no issues message when issues array is empty', () => {
//     mockResultData = {
//       issues: [],
//       bias_score: 0.3,
//       inclusivity_score: 0.8,
//       clarity_score: 0.7
//     }
    
//     render(<Analysis />)
    
//     expect(screen.getByText('Detected Biased Issues')).toBeInTheDocument()
//     expect(screen.getByText('No issues found! Your job description looks good.')).toBeInTheDocument()
//   })

//   it('displays issues when they exist', () => {
//     mockResultData = {
//       issues: [
//         {
//           type: 'Gender Bias',
//           text: 'guys',
//           explanation: 'Use gender-neutral language',
//           severity: 'high'
//         }
//       ],
//       bias_score: 0.8,
//       inclusivity_score: 0.5,
//       clarity_score: 0.7
//     }
    
//     render(<Analysis />)
    
//     expect(screen.getByText('Detected Biased Issues')).toBeInTheDocument()
//     expect(screen.getByText('Type: Gender Bias')).toBeInTheDocument()
//     expect(screen.getByText('"guys"')).toBeInTheDocument()
//     expect(screen.getByText('Use gender-neutral language')).toBeInTheDocument()
//   })

//   it('shows improved job description when available', () => {
//     mockResultData = {
//       improvedText: 'This is the improved job description text',
//       bias_score: 0.3,
//       inclusivity_score: 0.8,
//       clarity_score: 0.7
//     }
    
//     render(<Analysis />)
    
//     expect(screen.getByText('📝 Improved Job Description')).toBeInTheDocument()
//     expect(screen.getByTestId('improved-job-description')).toBeInTheDocument()
//   })

//   it('shows suggestions when available', () => {
//     mockResultData = {
//       suggestions: [
//         {
//           category: 'Language',
//           original: 'Original text',
//           improved: 'Improved text',
//           rationale: 'This is better because...'
//         }
//       ],
//       bias_score: 0.3,
//       inclusivity_score: 0.8,
//       clarity_score: 0.7
//     }
    
//     render(<Analysis />)
    
//     expect(screen.getByText('Improvement Suggestions for Inclusiveness and Clarity Issues')).toBeInTheDocument()
//     expect(screen.getByText('Category:')).toBeInTheDocument()
//     expect(screen.getByText('Language')).toBeInTheDocument()
//     expect(screen.getByText('Original Text:')).toBeInTheDocument()
//     expect(screen.getByText('Original text')).toBeInTheDocument()
//   })

//   it('shows SEO keywords when available', () => {
//     mockResultData = {
//       seo_keywords: ['JavaScript', 'React', 'Node.js'],
//       bias_score: 0.3,
//       inclusivity_score: 0.8,
//       clarity_score: 0.7
//     }
    
//     render(<Analysis />)
    
//     expect(screen.getByText('SEO Keywords to Add')).toBeInTheDocument()
//     expect(screen.getByText('JavaScript')).toBeInTheDocument()
//     expect(screen.getByText('React')).toBeInTheDocument()
//     expect(screen.getByText('Node.js')).toBeInTheDocument()
//   })

//   it('shows download button when scores are not all zero', () => {
//     mockResultData = {
//       bias_score: 0.3,
//       inclusivity_score: 0.8,
//       clarity_score: 0.7
//     }
    
//     render(<Analysis />)
    
//     expect(screen.getByText('Download Analysis Report (PDF)')).toBeInTheDocument()
//   })

//   it('handles download button click', async () => {
//     // Mock document methods
//     const mockElement = document.createElement('div')
//     mockElement.id = 'analysis-content'
//     document.body.appendChild(mockElement)
    
//     vi.spyOn(document, 'getElementById').mockReturnValue(mockElement)
    
    
//     mockResultData = {
//       bias_score: 0.3,
//       inclusivity_score: 0.8,
//       clarity_score: 0.7
//     }
    
//     render(<Analysis />)
    
//     const downloadButton = screen.getByText('Download Analysis Report (PDF)')
//     fireEvent.click(downloadButton)
    
//     // Should show loading state
//     expect(screen.getByText('Generating PDF...')).toBeInTheDocument()
//   })

  
// })

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../test-utils'
import Analysis from '../Analysis'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...(actual as object),
    useNavigate: () => mockNavigate,
    Link: ({ to, children, className }: any) => (
      <a href={to} className={className}>
        {children}
      </a>
    ),
  }
})

// Mock components
vi.mock('../../components/ImprovedJobDescription', () => ({
  default: ({ improvedText }: { improvedText: string }) => (
    <div data-testid="improved-job-description">
      {improvedText}
    </div>
  )
}))

vi.mock('../../components/JobFileViewer', () => ({
  default: ({ job }: { job: any }) => (
    <div data-testid="job-file-viewer">
      File: {job.originalFileName}
    </div>
  )
}))

// Mock API endpoints
vi.mock('../../utils/api', () => ({
  API_ENDPOINTS: {
    files: {
      viewFile: (fileName: string) => `http://localhost:5268/api/files/${fileName}/view`
    }
  }
}))

// Mock Redux - Fixed to include Provider and other exports
let mockResultData: any = null

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux')
  return {
    ...actual as object,
    useSelector: vi.fn().mockImplementation(() => mockResultData),
    // Include other commonly used exports that might be needed
    useDispatch: vi.fn(() => vi.fn()),
  }
})

describe('Analysis', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockResultData = null
    mockNavigate.mockClear()
  })

  it('redirects to home when no result data', () => {
    mockResultData = null
    
    render(<Analysis />)
    
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('shows no analysis data message when result is null', () => {
    mockResultData = null
    
    render(<Analysis />)
    
    expect(screen.getByText('No analysis data available')).toBeInTheDocument()
    expect(screen.getByText('Analyze New Job Description')).toBeInTheDocument()
  })

  it('renders analysis with basic result data', () => {
    mockResultData = {
      fileName: 'test-job.txt',
      bias_score: 0.3,
      inclusivity_score: 0.8,
      clarity_score: 0.7,
      overall_assessment: 'This is a good job description'
    }
    
    render(<Analysis />)
    
    expect(screen.getByText('Job Description Analysis')).toBeInTheDocument()
    expect(screen.getByText('test-job.txt')).toBeInTheDocument()
    expect(screen.getByText('Overall Assessment')).toBeInTheDocument()
    expect(screen.getByText('This is a good job description')).toBeInTheDocument()
  })

  it('shows analysis matrix when scores are not all zero', () => {
    mockResultData = {
      bias_score: 0.3,
      inclusivity_score: 0.8,
      clarity_score: 0.7,
      overall_assessment: 'Good job description'
    }
    
    render(<Analysis />)
    
    expect(screen.getByText('📊 Analysis Matrix')).toBeInTheDocument()
    expect(screen.getByText('Bias Level')).toBeInTheDocument()
    expect(screen.getByText('Inclusivity Score')).toBeInTheDocument()
    expect(screen.getByText('Clarity Score')).toBeInTheDocument()
  })

  it('hides analysis matrix when all scores are zero', () => {
    mockResultData = {
      bias_score: 0,
      inclusivity_score: 0,
      clarity_score: 0,
      overall_assessment: 'Basic assessment'
    }
    
    render(<Analysis />)
    
    expect(screen.queryByText('📊 Analysis Matrix')).not.toBeInTheDocument()
    expect(screen.getByText('Overall Assessment')).toBeInTheDocument()
  })

  it('shows file viewer when file data exists', () => {
    mockResultData = {
      fileUrl: 'http://example.com/file.pdf',
      originalFileName: 'job-description.pdf',
      contentType: 'application/pdf',
      fileSize: 1024,
      bias_score: 0.3,
      inclusivity_score: 0.8,
      clarity_score: 0.7
    }
    
    render(<Analysis />)
    
    expect(screen.getByText('📎 Uploaded File')).toBeInTheDocument()
    expect(screen.getByTestId('job-file-viewer')).toBeInTheDocument()
  })

  it('shows job role and industry when scores are not zero', () => {
    mockResultData = {
      role: 'Software Developer',
      industry: 'Technology',
      bias_score: 0.3,
      inclusivity_score: 0.8,
      clarity_score: 0.7
    }
    
    render(<Analysis />)
    
    expect(screen.getByText('Job Role')).toBeInTheDocument()
    expect(screen.getByText('Software Developer')).toBeInTheDocument()
    expect(screen.getByText('Job Industry')).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
  })

  it('shows no issues message when issues array is empty', () => {
    mockResultData = {
      issues: [],
      bias_score: 0.3,
      inclusivity_score: 0.8,
      clarity_score: 0.7
    }
    
    render(<Analysis />)
    
    expect(screen.getByText('Detected Issues')).toBeInTheDocument()
    expect(screen.getByText('No issues found! Your job description looks good.')).toBeInTheDocument()
  })

  it('displays issues when they exist', () => {
    mockResultData = {
      issues: [
        {
          type: 'Gender Bias',
          text: 'guys',
          explanation: 'Use gender-neutral language',
          severity: 'high'
        }
      ],
      bias_score: 0.8,
      inclusivity_score: 0.5,
      clarity_score: 0.7
    }
    
    render(<Analysis />)
    
    expect(screen.getByText('Detected Issues')).toBeInTheDocument()
    expect(screen.getByText('Type: Gender Bias')).toBeInTheDocument()
    expect(screen.getByText('"guys"')).toBeInTheDocument()
    expect(screen.getByText('Use gender-neutral language')).toBeInTheDocument()
  })

  it('shows improved job description when available', () => {
    mockResultData = {
      improvedText: 'This is the improved job description text',
      bias_score: 0.3,
      inclusivity_score: 0.8,
      clarity_score: 0.7
    }
    
    render(<Analysis />)
    
    expect(screen.getByText('📝 Improved Job Description')).toBeInTheDocument()
    
  })

  it('shows suggestions when available', () => {
    mockResultData = {
      suggestions: [
        {
          category: 'Language',
          original: 'Original text',
          improved: 'Improved text',
          rationale: 'This is better because...'
        }
      ],
      bias_score: 0.3,
      inclusivity_score: 0.8,
      clarity_score: 0.7
    }
    
    render(<Analysis />)
    
    expect(screen.getByText('Improvement Suggestions for Inclusiveness and Clarity Issues')).toBeInTheDocument()
    expect(screen.getByText('Category:')).toBeInTheDocument()
    expect(screen.getByText('Language')).toBeInTheDocument()
    expect(screen.getByText('Original Text:')).toBeInTheDocument()
    expect(screen.getByText('Original text')).toBeInTheDocument()
  })

  it('shows SEO keywords when available', () => {
    mockResultData = {
      seo_keywords: ['JavaScript', 'React', 'Node.js'],
      bias_score: 0.3,
      inclusivity_score: 0.8,
      clarity_score: 0.7
    }
    
    render(<Analysis />)
    
    expect(screen.getByText('SEO keywords not present in the original job description')).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
  })
});