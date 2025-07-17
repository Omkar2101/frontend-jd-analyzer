import { render, screen } from '@testing-library/react';
import AnalysisDetail from '../AnalysisDetail';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');
const mockedAxios = vi.mocked(axios)

describe('AnalysisDetail Page', () => {
  it('renders analysis detail for a job', async () => {
    (mockedAxios.get as unknown as { mockResolvedValueOnce: Function }).mockResolvedValueOnce({
      data: {
        id: '123',
        userEmail: 'test@example.com',
        originalText: 'Original job text', // This contains "Original" and "text"
        improvedText: 'Improved job text',
        fileName: 'job.pdf',
        createdAt: '2025-06-22T12:00:00Z',
        analysis: {
          bias_score: 0.8,
          inclusivity_score: 0.7,
          clarity_score: 0.9,
          issues: [],
          overall_assessment: 'This is a mock assessment.',
          suggestions: [
            {
              original: 'Sample original text',
              improved: 'Sample improved text',
              rationale: 'This is a sample rationale',
              category: 'bias'
            }
          ],
          seo_keywords: []
        }
      }
    });

    render(
      <MemoryRouter initialEntries={["/analysis/123"]}>
        <Routes>
          <Route path="/analysis/:id" element={<AnalysisDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // More specific regex that looks for "Original Text:" (with colon)
    expect(await screen.findByText(/Job Description Analysis/i)).toBeInTheDocument();
    expect(await screen.findByText(/Improvement Suggestions/i)).toBeInTheDocument();
    
    // This should find exactly 1 occurrence of "Original Text:" heading
    expect(screen.getAllByText(/Original Text:/i)).toHaveLength(1);
    expect(screen.getAllByText(/Improved Version:/i)).toHaveLength(1);
    
    // Debug: Let's see what the regex is actually matching
    console.log('Elements matching /Original Text/i:', screen.getAllByText(/Original Text/i));
  });

  it('renders analysis detail without suggestions', async () => {
    (mockedAxios.get as unknown as { mockResolvedValueOnce: Function }).mockResolvedValueOnce({
      data: {
        id: '123',
        userEmail: 'test@example.com',
        originalText: 'Some job description text', // Changed this to not contain "Original"
        improvedText: 'Improved job text',
        fileName: 'job.pdf',
        createdAt: '2025-06-22T12:00:00Z',
        analysis: {
          bias_score: 0.8,
          inclusivity_score: 0.7,
          clarity_score: 0.9,
          overall_assessment: 'This is a mock assessment.',
          issues: [],
          suggestions: [],
          seo_keywords: []
        }
      }
    });

    render(
      <MemoryRouter initialEntries={["/analysis/123"]}>
        <Routes>
          <Route path="/analysis/:id" element={<AnalysisDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Job Description Analysis/i)).toBeInTheDocument();
    expect(await screen.findByText(/Bias Score/i)).toBeInTheDocument();
    expect(await screen.findByText(/Inclusivity Score/i)).toBeInTheDocument();
    expect(await screen.findByText(/Clarity Score/i)).toBeInTheDocument();
    
    // These should NOT be present when suggestions array is empty
    expect(screen.queryByText(/Original Text:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Improved Version:/i)).not.toBeInTheDocument();
  });
});