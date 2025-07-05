import { render, screen } from '@testing-library/react';
import DummyAnalysis from '../DummyAnalysis';
import { BrowserRouter } from 'react-router-dom';

describe('DummyAnalysis Page', () => {
  it('renders mock analysis report', () => {
    render(
      <BrowserRouter>
        <DummyAnalysis />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Bias Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Improvement Suggestions/i)).toBeInTheDocument();
  });
});
