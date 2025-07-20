// import { render, screen, waitFor } from '@testing-library/react';
// import Download from '../Download';
// import { Provider } from 'react-redux';
// import { configureStore } from '@reduxjs/toolkit';
// import { BrowserRouter } from 'react-router-dom';
// import { vi } from 'vitest';

// // Mock html2pdf.js
// vi.mock('html2pdf.js', () => ({
//   default: vi.fn(() => ({
//     set: vi.fn(() => ({
//       from: vi.fn(() => ({
//         save: vi.fn(() => Promise.resolve())
//       }))
//     }))
//   }))
// }));

// // Mock useNavigate
// const mockNavigate = vi.fn();
// vi.mock('react-router-dom', async () => {
//   const actual = await vi.importActual('react-router-dom');
//   return {
//     ...actual as object,
//     useNavigate: () => mockNavigate,
//   };
// });

// // Create a mock store with the expected structure
// const createMockStore = (resultData: any) => {
//   return configureStore({
//     reducer: {
//       result: (state = { data: resultData }, action) => {
//         switch (action.type) {
//           case 'result/setData':
//             return { ...state, data: action.payload };
//           default:
//             return state;
//         }
//       }
//     }
//   });
// };

// describe('Download Page', () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//     // Mock getElementById to return a mock HTMLElement
//     global.document.getElementById = vi.fn(() =>
//       Object.assign(document.createElement('div'), { innerHTML: '<div>Mock content</div>' })
//     );
//   });

//   it('renders analysis content and triggers download', async () => {
//     const mockResultData = {
//       bias_score: 0.8,
//       inclusivity_score: 0.7,
//       clarity_score: 0.9,
//       issues: [],
//       suggestions: [],
//       seo_keywords: [],
//       overall_assessment: 'This is a mock assessment.'
//     };

//     const mockStore = createMockStore(mockResultData);

//     render(
//       <Provider store={mockStore}>
//         <BrowserRouter>
//           <Download />
//         </BrowserRouter>
//       </Provider>
//     );

//     expect(screen.getByText(/Job Description Analysis/i)).toBeInTheDocument();
//     expect(screen.getByText(/Bias Score/i)).toBeInTheDocument();
//     expect(screen.getByText(/Inclusivity Score/i)).toBeInTheDocument();
//     expect(screen.getByText(/Clarity Score/i)).toBeInTheDocument();
//     expect(screen.getByText(/80.0%/i)).toBeInTheDocument();
//     expect(screen.getByText(/70.0%/i)).toBeInTheDocument();
//     expect(screen.getByText(/90.0%/i)).toBeInTheDocument();
//   });

  

//   it('redirects to home when no result data', async () => {
//     const mockStore = createMockStore(null);

//     render(
//       <Provider store={mockStore}>
//         <BrowserRouter>
//           <Download />
//         </BrowserRouter>
//       </Provider>
//     );

//     await waitFor(() => {
//       expect(mockNavigate).toHaveBeenCalledWith('/');
//     });
//   });

//   it('renders suggestions when available', async () => {
//     const mockResultData = {
//       bias_score: 0.8,
//       inclusivity_score: 0.7,
//       clarity_score: 0.9,
//       issues: [],
//       suggestions: [
//         {
//           original: 'Original text example',
//           improved: 'Improved text example',
//           rationale: 'This is the rationale',
//           category: 'bias'
//         }
//       ],
//       seo_keywords: []
//     };

//     const mockStore = createMockStore(mockResultData);

//     render(
//       <Provider store={mockStore}>
//         <BrowserRouter>
//           <Download />
//         </BrowserRouter>
//       </Provider>
//     );

//     expect(screen.getByText(/Improvement Suggestions/i)).toBeInTheDocument();
//     expect(screen.getByText(/Original Text:/i)).toBeInTheDocument();
//     expect(screen.getByText(/Improved Version:/i)).toBeInTheDocument();
//     expect(screen.getByText(/Original text example/i)).toBeInTheDocument();
//     expect(screen.getByText(/Improved text example/i)).toBeInTheDocument();
//   });

//   it('renders issues when available', async () => {
//     const mockResultData = {
//       bias_score: 0.8,
//       inclusivity_score: 0.7,
//       clarity_score: 0.9,
//       issues: [
//         {
//           type: 'Gender Bias',
//           text: 'problematic text',
//           explanation: 'This is problematic because...',
//           severity: 'high'
//         }
//       ],
//       suggestions: [],
//       seo_keywords: []
//     };

//     const mockStore = createMockStore(mockResultData);

//     render(
//       <Provider store={mockStore}>
//         <BrowserRouter>
//           <Download />
//         </BrowserRouter>
//       </Provider>
//     );

//     expect(screen.getByText(/Detected Issues/i)).toBeInTheDocument();
//     expect(screen.getByText(/Gender Bias/i)).toBeInTheDocument();
//     expect(screen.getByText(/problematic text/i)).toBeInTheDocument();
//     expect(screen.getByText(/high/i)).toBeInTheDocument();
//   });

//   it('renders SEO keywords when available', async () => {
//     const mockResultData = {
//       bias_score: 0.8,
//       inclusivity_score: 0.7,
//       clarity_score: 0.9,
//       issues: [],
//       suggestions: [],
//       seo_keywords: ['keyword1', 'keyword2']
//     };

//     const mockStore = createMockStore(mockResultData);

//     render(
//       <Provider store={mockStore}>
//         <BrowserRouter>
//           <Download />
//         </BrowserRouter>
//       </Provider>
//     );

//     expect(screen.getByText(/Seo keywords to add in the text/i)).toBeInTheDocument();
//     expect(screen.getByText(/keyword1/i)).toBeInTheDocument();
//     expect(screen.getByText(/keyword2/i)).toBeInTheDocument();
//   });
// });

import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock html2pdf.js module - define inline to avoid hoisting issues
vi.mock('html2pdf.js', () => {
  const mockSave = vi.fn(() => Promise.resolve());
  const mockFrom = vi.fn(() => ({ save: mockSave }));
  const mockSet = vi.fn(() => ({ from: mockFrom }));
  const mockHtml2pdf = vi.fn(() => ({ set: mockSet }));
  
  return {
    default: mockHtml2pdf
  };
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as object,
    useNavigate: () => mockNavigate,
  };
});

// Import components after mocking
import Download from '../Download';
import html2pdf from 'html2pdf.js';

// Get references to the mock functions for assertions
const mockHtml2pdf = html2pdf as any;

// Create a mock store with the expected structure
const createMockStore = (resultData: any) => {
  return configureStore({
    reducer: {
      result: (state = { data: resultData }, action) => {
        switch (action.type) {
          case 'result/setData':
            return { ...state, data: action.payload };
          default:
            return state;
        }
      }
    }
  });
};

describe('Download Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    
    // Mock getElementById to return a mock HTMLElement
    global.document.getElementById = vi.fn(() =>
      Object.assign(document.createElement('div'), { 
        innerHTML: '<div>Mock content</div>',
        id: 'analysis-content'
      })
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders analysis content with correct scores', async () => {
    const mockResultData = {
      bias_score: 0.8,
      inclusivity_score: 0.7,
      clarity_score: 0.9,
      issues: [],
      suggestions: [],
      seo_keywords: [],
      overall_assessment: 'This is a mock assessment.'
    };

    const mockStore = createMockStore(mockResultData);

    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Download />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Job Description Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Bias Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Inclusivity Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Clarity Score/i)).toBeInTheDocument();
    expect(screen.getByText(/80.0%/i)).toBeInTheDocument();
    expect(screen.getByText(/70.0%/i)).toBeInTheDocument();
    expect(screen.getByText(/90.0%/i)).toBeInTheDocument();
  });

 

  it('renders suggestions when available', async () => {
    const mockResultData = {
      bias_score: 0.8,
      inclusivity_score: 0.7,
      clarity_score: 0.9,
      issues: [],
      suggestions: [
        {
          original: 'Original text example',
          improved: 'Improved text example',
          rationale: 'This is the rationale',
          category: 'bias'
        }
      ],
      seo_keywords: []
    };

    const mockStore = createMockStore(mockResultData);

    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Download />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Improvement Suggestions/i)).toBeInTheDocument();
    expect(screen.getByText(/Original Text:/i)).toBeInTheDocument();
    expect(screen.getByText(/Improved Version:/i)).toBeInTheDocument();
    expect(screen.getByText(/Original text example/i)).toBeInTheDocument();
    expect(screen.getByText(/Improved text example/i)).toBeInTheDocument();
    expect(screen.getByText(/This is the rationale/i)).toBeInTheDocument();
  });

  it('renders issues when available', async () => {
    const mockResultData = {
      bias_score: 0.8,
      inclusivity_score: 0.7,
      clarity_score: 0.9,
      issues: [
        {
          type: 'Gender Bias',
          text: 'problematic text',
          explanation: 'This is problematic because...',
          severity: 'high'
        }
      ],
      suggestions: [],
      seo_keywords: []
    };

    const mockStore = createMockStore(mockResultData);

    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Download />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Detected Issues/i)).toBeInTheDocument();
    expect(screen.getByText(/Type: Gender Bias/i)).toBeInTheDocument();
    expect(screen.getByText(/problematic text/i)).toBeInTheDocument();
    expect(screen.getByText(/This is problematic because.../i)).toBeInTheDocument();
    expect(screen.getByText(/high/i)).toBeInTheDocument();
  });

  it('renders SEO keywords when available', async () => {
    const mockResultData = {
      bias_score: 0.8,
      inclusivity_score: 0.7,
      clarity_score: 0.9,
      issues: [],
      suggestions: [],
      seo_keywords: ['keyword1', 'keyword2']
    };

    const mockStore = createMockStore(mockResultData);

    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Download />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/Seo keywords to add in the text/i)).toBeInTheDocument();
    expect(screen.getByText(/keyword1/i)).toBeInTheDocument();
    expect(screen.getByText(/keyword2/i)).toBeInTheDocument();
  });

  

  it('does not render issues section when no issues', async () => {
    const mockResultData = {
      bias_score: 0.8,
      inclusivity_score: 0.7,
      clarity_score: 0.9,
      issues: [],
      suggestions: [],
      seo_keywords: []
    };

    const mockStore = createMockStore(mockResultData);

    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Download />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.queryByText(/No issues found! Your job description looks good/i)).toBeInTheDocument();
  });

  it('does not render suggestions section when no suggestions', async () => {
    const mockResultData = {
      bias_score: 0.8,
      inclusivity_score: 0.7,
      clarity_score: 0.9,
      issues: [],
      suggestions: [],
      seo_keywords: []
    };

    const mockStore = createMockStore(mockResultData);

    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Download />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.queryByText(/No suggestions needed! Your job description is well-written/i)).toBeInTheDocument();
  });

  it('does not render SEO keywords section when no keywords', async () => {
    const mockResultData = {
      bias_score: 0.8,
      inclusivity_score: 0.7,
      clarity_score: 0.9,
      issues: [],
      suggestions: [],
      seo_keywords: []
    };

    const mockStore = createMockStore(mockResultData);

    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Download />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.queryByText(/Seo keywords to add in the text/i)).not.toBeInTheDocument();
  });

 

  it('applies correct CSS classes for bias scores', async () => {
    const mockResultData = {
      bias_score: 0.9, // High bias should be red/danger
      inclusivity_score: 0.5, // Low score should be red/danger
      clarity_score: 0.7, // Medium score should be yellow/warning
      issues: [],
      suggestions: [],
      seo_keywords: []
    };

    const mockStore = createMockStore(mockResultData);

    const { container } = render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Download />
        </BrowserRouter>
      </Provider>
    );

    // Check for appropriate CSS classes based on scoring logic
    expect(container.querySelector('.border-danger')).toBeInTheDocument(); // High bias
    expect(container.querySelector('.border-warning')).toBeInTheDocument(); // Medium clarity
    expect(container.querySelector('.text-danger')).toBeInTheDocument(); // Low inclusivity
  });
});