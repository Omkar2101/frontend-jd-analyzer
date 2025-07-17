import { render, screen, waitFor } from '@testing-library/react';
import Download from '../Download';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock html2pdf.js
vi.mock('html2pdf.js', () => ({
  default: vi.fn(() => ({
    set: vi.fn(() => ({
      from: vi.fn(() => ({
        save: vi.fn(() => Promise.resolve())
      }))
    }))
  }))
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as object,
    useNavigate: () => mockNavigate,
  };
});

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
    // Mock getElementById to return a mock HTMLElement
    global.document.getElementById = vi.fn(() =>
      Object.assign(document.createElement('div'), { innerHTML: '<div>Mock content</div>' })
    );
  });

  it('renders analysis content and triggers download', async () => {
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

  it('redirects to home when no result data', async () => {
    const mockStore = createMockStore(null);

    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <Download />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
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
    expect(screen.getByText(/Gender Bias/i)).toBeInTheDocument();
    expect(screen.getByText(/problematic text/i)).toBeInTheDocument();
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
});