// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock analyze job API
  http.post('http://localhost:5268/api/jobs/analyze', async ({ request }) => {
    const body = await request.json()
    
    return HttpResponse.json({
      bias_score: 0.75,
      inclusivity_score: 0.85,
      clarity_score: 0.90,
      issues: [
        {
          type: 'Gender Bias',
          text: 'guys',
          explanation: 'Consider using gender-neutral language like "team members" or "people"',
          severity: 'medium'
        }
      ],
      suggestions: [
        {
          original: 'Looking for guys to join our team',
          improved: 'Looking for team members to join our team',
          rationale: 'More inclusive and professional language'
        }
      ],
      seo_keywords: ['software engineer', 'react developer', 'frontend developer']
    })
  }),

  // Mock file upload API
  http.post('http://localhost:5268/api/jobs/upload', async ({ request }) => {
    return HttpResponse.json({
      bias_score: 0.80,
      inclusivity_score: 0.70,
      clarity_score: 0.85,
      issues: [],
      suggestions: [],
      seo_keywords: ['backend developer', 'node.js', 'api development']
    })
  }),

  // Mock get user jobs API
  http.get('http://localhost:5268/api/jobs/user/:email', ({ params }) => {
    const { email } = params
    
    if (email === 'user@example.com') {
      return HttpResponse.json([
        {
          id: '1',
          title: 'Software Engineer',
          originalText: 'We are looking for a passionate software engineer to join our team. The ideal candidate should have strong problem-solving skills...',
          improvedText: 'We are seeking a passionate software engineer to join our team. The ideal candidate should have strong problem-solving skills...',
          fileName: 'software-engineer.txt',
          createdAt: '2024-01-15T10:30:00Z',
          analysis: {
            bias_score: 0.8,
            inclusivity_score: 0.9,
            clarity_score: 0.7
          }
        },
        {
          id: '2',
          title: 'Frontend Developer',
          originalText: 'Looking for a frontend developer who can work with React and TypeScript...',
          improvedText: 'Seeking a frontend developer with expertise in React and TypeScript...',
          fileName: 'frontend-dev.pdf',
          createdAt: '2024-01-10T14:20:00Z',
          analysis: {
            bias_score: 0.9,
            inclusivity_score: 0.8,
            clarity_score: 0.9
          }
        }
      ])
    }
    
    return HttpResponse.json([])
  }),

  // Mock error scenarios
  http.post('http://localhost:5268/api/jobs/analyze-error', () => {
    return HttpResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    )
  }),

  // Mock network error
  http.post('http://localhost:5268/api/jobs/network-error', () => {
    return HttpResponse.error()
  })
]

