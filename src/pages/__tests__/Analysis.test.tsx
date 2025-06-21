import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../test-utils'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import resultSlice from '../../store/resultSlice'
import Analysis from '../Analysis'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual as object,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: any) => <a href={to}>{children}</a>
  }
})

const mockAnalysisData = {
  bias_score: 0.8,
  inclusivity_score: 0.9,
  clarity_score: 0.7,
  issues: [
    {
      type: 'Gender Bias',
      text: 'guys',
      explanation: 'Use gender-neutral language',
      severity: 'medium'
    }
  ],
  suggestions: [
    {
      original: 'Looking for guys to join our team',
      improved: 'Looking for people to join our team',
      rationale: 'More inclusive language'
    }
  ],
  seo_keywords: ['software engineer', 'react developer']
}

const createMockStore = (initialState: any, updatedJD: string = '') => {
  return configureStore({
    reducer: {
      result: resultSlice
    },
    preloadedState: {
      result: { data: initialState, updatedJD }
    }
  })
}

describe('Analysis', () => {
  it('redirects to home when no analysis data', () => {
    const store = createMockStore(null)
    
    render(
      <Provider store={store}>
        <Analysis />
      </Provider>
    )
    
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('renders analysis data correctly', () => {
    const store = createMockStore(mockAnalysisData)
    
    render(
      <Provider store={store}>
        <Analysis />
      </Provider>
    )
    
    expect(screen.getByText(/job description analysis/i)).toBeInTheDocument()
    expect(screen.getByText(/bias score/i)).toBeInTheDocument()
    expect(screen.getByText(/80.0%/)).toBeInTheDocument()
    expect(screen.getByText(/90.0%/)).toBeInTheDocument()
    expect(screen.getByText(/70.0%/)).toBeInTheDocument()
  })

  it('displays detected issues', () => {
    const store = createMockStore(mockAnalysisData)
    
    render(
      <Provider store={store}>
        <Analysis />
      </Provider>
    )
    
    expect(screen.getByText(/detected issues/i)).toBeInTheDocument()
    expect(screen.getByText(/gender bias/i)).toBeInTheDocument()
    
    // More specific query to find the "guys" text in the issues section
    const issuesSection = screen.getByText(/detected issues/i).closest('.card')
    expect(issuesSection).toContainElement(screen.getByText('"guys"'))
    
    // Alternative approach: Use getAllByText and verify count
    // const guysElements = screen.getAllByText(/guys/i)
    // expect(guysElements).toHaveLength(2) // One in issues, one in suggestions
  })

  it('displays improvement suggestions', () => {
    const store = createMockStore(mockAnalysisData)
    
    render(
      <Provider store={store}>
        <Analysis />
      </Provider>
    )
    
    expect(screen.getByText(/improvement suggestions/i)).toBeInTheDocument()
    expect(screen.getByText(/looking for guys to join our team/i)).toBeInTheDocument()
    expect(screen.getByText(/looking for people to join our team/i)).toBeInTheDocument()
  })

  it('displays SEO keywords', () => {
    const store = createMockStore(mockAnalysisData)
    
    render(
      <Provider store={store}>
        <Analysis />
      </Provider>
    )
    
    expect(screen.getByText(/seo keywords to add in the text/i)).toBeInTheDocument()
    expect(screen.getByText('software engineer')).toBeInTheDocument()
    expect(screen.getByText('react developer')).toBeInTheDocument()
  })
})