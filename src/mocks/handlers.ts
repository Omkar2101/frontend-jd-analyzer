// // src/mocks/handlers.ts
// import { http, HttpResponse } from 'msw'

// export const handlers = [
//   // Mock analyze job API
//   http.post('http://localhost:5268/api/jobs/analyze', async ({ request }) => {
//     const body = await request.json()
    
//     return HttpResponse.json({
//       bias_score: 0.75,
//       inclusivity_score: 0.85,
//       clarity_score: 0.90,
//       issues: [
//         {
//           type: 'Gender Bias',
//           text: 'guys',
//           explanation: 'Consider using gender-neutral language like "team members" or "people"',
//           severity: 'medium'
//         }
//       ],
//       suggestions: [
//         {
//           original: 'Looking for guys to join our team',
//           improved: 'Looking for team members to join our team',
//           rationale: 'More inclusive and professional language'
//         }
//       ],
//       seo_keywords: ['software engineer', 'react developer', 'frontend developer']
//     })
//   }),

//   // Mock file upload API
//   http.post('http://localhost:5268/api/jobs/upload', async ({ request }) => {
//     return HttpResponse.json({
//       bias_score: 0.80,
//       inclusivity_score: 0.70,
//       clarity_score: 0.85,
//       issues: [],
//       suggestions: [],
//       seo_keywords: ['backend developer', 'node.js', 'api development']
//     })
//   }),

//   // Mock get user jobs API
//   http.get('http://localhost:5268/api/jobs/user/:email', ({ params }) => {
//     const { email } = params
    
//     if (email === 'user@example.com') {
//       return HttpResponse.json([
//         {
//           id: '1',
//           title: 'Software Engineer',
//           originalText: 'We are looking for a passionate software engineer to join our team. The ideal candidate should have strong problem-solving skills...',
//           improvedText: 'We are seeking a passionate software engineer to join our team. The ideal candidate should have strong problem-solving skills...',
//           fileName: 'software-engineer.txt',
//           createdAt: '2024-01-15T10:30:00Z',
//           analysis: {
//             bias_score: 0.8,
//             inclusivity_score: 0.9,
//             clarity_score: 0.7
//           }
//         },
//         {
//           id: '2',
//           title: 'Frontend Developer',
//           originalText: 'Looking for a frontend developer who can work with React and TypeScript...',
//           improvedText: 'Seeking a frontend developer with expertise in React and TypeScript...',
//           fileName: 'frontend-dev.pdf',
//           createdAt: '2024-01-10T14:20:00Z',
//           analysis: {
//             bias_score: 0.9,
//             inclusivity_score: 0.8,
//             clarity_score: 0.9
//           }
//         }
//       ])
//     }
    
//     return HttpResponse.json([])
//   }),

//   // Mock error scenarios
//   http.post('http://localhost:5268/api/jobs/analyze-error', () => {
//     return HttpResponse.json(
//       { error: 'Analysis failed. Please try again.' },
//       { status: 500 }
//     )
//   }),

//   // Mock network error
//   http.post('http://localhost:5268/api/jobs/network-error', () => {
//     return HttpResponse.error()
//   })
// ]


// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

// Define the request body interface
interface AnalyzeJobRequest {
  userEmail?: string;
  originalText?: string;
  fileName?: string;
  fileContent?: string;
  contentType?: string;
}

export const handlers = [
  
  // Mock analyze job API
  http.post('http://localhost:5268/api/jobs/analyze', async ({ request }) => {
    const body = await request.json() as AnalyzeJobRequest;
    
    return HttpResponse.json({
      id: 'job_123',
      userEmail: body.userEmail || 'user@example.com',
      originalText: 'We are looking for guys to join our development team. The ideal rockstar should have strong problem-solving skills and be a ninja in coding.',
      improvedText: 'We are seeking team members to join our development team. The ideal candidate should have strong problem-solving skills and expertise in coding.',
      fileName: 'job-description.txt',
      originalFileName: 'software-engineer-role.txt',
      contentType: 'text/plain',
      fileSize: 2048,
      fileUrl: 'https://example.com/files/job-description.txt',
      createdAt: '2024-01-15T10:30:00Z',
      analysis: {
        overall_assessment: 'This job description contains some bias issues and could benefit from more inclusive language. The technical requirements are clear, but the tone could be more professional.',
        bias_score: 0.75,
        inclusivity_score: 0.65,
        clarity_score: 0.80,
        role: 'Software Engineer',
        industry: 'Technology',
        issues: [
          {
            type: 'Gender Bias',
            text: 'guys',
            severity: 'medium',
            explanation: 'This term may exclude non-male candidates. Consider using gender-neutral language like "team members" or "people"'
          },
          {
            type: 'Professional Language',
            text: 'rockstar',
            severity: 'low',
            explanation: 'Using buzzwords like "rockstar" can be off-putting. Consider more professional terms like "exceptional candidate"'
          },
          {
            type: 'Professional Language',
            text: 'ninja',
            severity: 'low',
            explanation: 'Avoid informal terms. Use "expert" or "skilled professional" instead'
          }
        ],
        suggestions: [
          {
            original: 'We are looking for guys to join our development team',
            improved: 'We are seeking team members to join our development team',
            rationale: 'More inclusive language that welcomes all genders and maintains professionalism',
            category: 'Gender Inclusivity'
          },
          {
            original: 'The ideal rockstar should have strong problem-solving skills',
            improved: 'The ideal candidate should have strong problem-solving skills',
            rationale: 'Professional terminology that focuses on qualifications rather than buzzwords',
            category: 'Professional Language'
          },
          {
            original: 'be a ninja in coding',
            improved: 'have expertise in coding',
            rationale: 'Clear, professional language that better describes the required skill level',
            category: 'Clarity and Professionalism'
          }
        ],
        seo_keywords: [
          'software development',
          'programming skills',
          'problem solving',
          'team collaboration',
          'technical expertise'
        ]
      }
    })
  }),

  // Mock file upload API
  http.post('http://localhost:5268/api/jobs/upload', async ({ params }) => {
    const { id } = params as { id: string };

    return HttpResponse.json({
      id:id || 'job_456',
      userEmail: 'user@example.com',
      originalText: 'Senior Backend Developer position available. Must be proficient in Node.js and database management.',
      improvedText: 'Senior Backend Developer position available. Must be proficient in Node.js and database management. We welcome applications from all qualified candidates.',
      fileName: 'backend-role.pdf',
      originalFileName: 'senior-backend-developer.pdf',
      contentType: 'application/pdf',
      fileSize: 4096,
      fileUrl: 'https://example.com/files/backend-role.pdf',
      createdAt: '2024-01-20T09:15:00Z',
      analysis: {
        overall_assessment: 'This job description is well-written with clear requirements. Minor improvements could enhance inclusivity.',
        bias_score: 0.20,
        inclusivity_score: 0.85,
        clarity_score: 0.90,
        role: 'Senior Backend Developer',
        industry: 'Software Development',
        issues: [],
        suggestions: [
          {
            original: 'Must be proficient in Node.js and database management.',
            improved: 'Must be proficient in Node.js and database management. We welcome applications from all qualified candidates.',
            rationale: 'Adding an inclusive statement encourages diverse applicants',
            category: 'Inclusivity Enhancement'
          }
        ],
        seo_keywords: [
          'backend development',
          'node.js developer',
          'database management',
          'api development',
          'server-side programming'
        ]
      }
    })
  }),

  // Mock get job by ID API
  http.get('http://localhost:5268/api/jobs/:id', ({ params }) => {
    const { id } = params
    
    return HttpResponse.json({
      id: id,
      userEmail: 'user@example.com',
      originalText: 'We need passionate developers who can think outside the box. Looking for rockstars to join our dynamic team.',
      improvedText: 'We need passionate developers who can think creatively. Looking for exceptional candidates to join our dynamic team.',
      fileName: `job-${id}.txt`,
      originalFileName: `original-job-${id}.txt`,
      contentType: 'text/plain',
      fileSize: 1536,
      fileUrl: `https://example.com/files/job-${id}.txt`,
      createdAt: '2024-01-18T16:45:00Z',
      analysis: {
        overall_assessment: 'The job description has good energy but contains some buzzwords that could be more professional. The requirements are clear.',
        bias_score: 0.40,
        inclusivity_score: 0.75,
        clarity_score: 0.85,
        role: 'Full Stack Developer',
        industry: 'Technology',
        issues: [
          {
            type: 'Professional Language',
            text: 'rockstars',
            severity: 'medium',
            explanation: 'Professional terms like "exceptional candidates" or "talented professionals" would be more appropriate'
          }
        ],
        suggestions: [
          {
            original: 'Looking for rockstars to join our dynamic team',
            improved: 'Looking for exceptional candidates to join our dynamic team',
            rationale: 'More professional language while maintaining enthusiasm',
            category: 'Professional Language'
          }
        ],
        seo_keywords: [
          'full stack development',
          'web development',
          'javascript developer',
          'frontend backend',
          'software engineering'
        ]
      }
    })
  }),

  // Mock get user jobs API
  http.get('http://localhost:5268/api/jobs/user/:email', ({ params }) => {
    const { email } = params
    
    if (email === 'user@example.com') {
      return HttpResponse.json([
        {
          id: '1',
          userEmail: 'user@example.com',
          originalText: 'We are looking for a passionate software engineer to join our team. The ideal candidate should have strong problem-solving skills...',
          improvedText: 'We are seeking a passionate software engineer to join our team. The ideal candidate should have strong problem-solving skills...',
          fileName: 'software-engineer.txt',
          originalFileName: 'se-role-original.txt',
          contentType: 'text/plain',
          fileSize: 2048,
          fileUrl: 'https://example.com/files/software-engineer.txt',
          createdAt: '2024-01-15T10:30:00Z',
          analysis: {
            overall_assessment: 'Good technical job description with room for inclusivity improvements.',
            bias_score: 0.30,
            inclusivity_score: 0.80,
            clarity_score: 0.90,
            role: 'Software Engineer',
            industry: 'Technology',
            issues: [],
            suggestions: [],
            seo_keywords: ['software engineering', 'programming', 'development']
          }
        },
        {
          id: '2',
          userEmail: 'user@example.com',
          originalText: 'Looking for a frontend developer who can work with React and TypeScript...',
          improvedText: 'Seeking a frontend developer with expertise in React and TypeScript...',
          fileName: 'frontend-dev.pdf',
          originalFileName: 'frontend-developer-role.pdf',
          contentType: 'application/pdf',
          fileSize: 3072,
          fileUrl: 'https://example.com/files/frontend-dev.pdf',
          createdAt: '2024-01-10T14:20:00Z',
          analysis: {
            overall_assessment: 'Clear and well-structured job description with good technical requirements.',
            bias_score: 0.15,
            inclusivity_score: 0.85,
            clarity_score: 0.95,
            role: 'Frontend Developer',
            industry: 'Web Development',
            issues: [],
            suggestions: [],
            seo_keywords: ['frontend development', 'react developer', 'typescript', 'ui development']
          }
        }
      ])
    }
    
    return HttpResponse.json([])
  }),

  // Mock zero scores scenario
  http.get('http://localhost:5268/api/jobs/zero-scores', () => {
    return HttpResponse.json({
      id: 'job_zero',
      userEmail: 'user@example.com',
      originalText: 'Perfect job description with no issues.',
      improvedText: 'Perfect job description with no issues.',
      fileName: 'perfect-job.txt',
      originalFileName: 'perfect-job-original.txt',
      contentType: 'text/plain',
      fileSize: 512,
      fileUrl: 'https://example.com/files/perfect-job.txt',
      createdAt: '2024-01-25T12:00:00Z',
      analysis: {
        overall_assessment: 'This job description is excellently written with no bias, perfect inclusivity, and outstanding clarity.',
        bias_score: 0,
        inclusivity_score: 0,
        clarity_score: 0,
        role: '',
        industry: '',
        issues: [],
        suggestions: [],
        seo_keywords: []
      }
    })
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
  }),

  // Mock job not found
  http.get('http://localhost:5268/api/jobs/not-found', () => {
    return HttpResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    )
  })
]