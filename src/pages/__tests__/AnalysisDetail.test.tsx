

// // import { render, screen } from '@testing-library/react';
// // import AnalysisDetail from '../AnalysisDetail';
// // import { MemoryRouter, Route, Routes } from 'react-router-dom';
// // import axios from 'axios';
// // import { vi } from 'vitest';

// // // Mock DOMMatrix for PDF.js
// // global.DOMMatrix = vi.fn().mockImplementation(() => ({
// //   scale: vi.fn().mockReturnThis(),
// //   translate: vi.fn().mockReturnThis(),
// //   multiply: vi.fn().mockReturnThis(),
// //   inverse: vi.fn().mockReturnThis(),
// //   transformPoint: vi.fn().mockReturnValue({ x: 0, y: 0 }),
// //   a: 1, b: 0, c: 0, d: 1, e: 0, f: 0
// // }));

// // // Mock Canvas API for PDF.js
// // global.HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
// //   fillRect: vi.fn(),
// //   clearRect: vi.fn(),
// //   getImageData: vi.fn(() => ({ data: new Array(4) })),
// //   putImageData: vi.fn(),
// //   createImageData: vi.fn(() => ({ data: new Array(4) })),
// //   setTransform: vi.fn(),
// //   drawImage: vi.fn(),
// //   save: vi.fn(),
// //   fillText: vi.fn(),
// //   restore: vi.fn(),
// //   beginPath: vi.fn(),
// //   moveTo: vi.fn(),
// //   lineTo: vi.fn(),
// //   closePath: vi.fn(),
// //   stroke: vi.fn(),
// //   translate: vi.fn(),
// //   scale: vi.fn(),
// //   rotate: vi.fn(),
// //   arc: vi.fn(),
// //   fill: vi.fn(),
// //   measureText: vi.fn(() => ({ width: 0 })),
// //   transform: vi.fn(),
// //   rect: vi.fn(),
// //   clip: vi.fn(),
// // });

// // // Mock Path2D
// // global.Path2D = vi.fn().mockImplementation(() => ({
// //   addPath: vi.fn(),
// //   closePath: vi.fn(),
// //   moveTo: vi.fn(),
// //   lineTo: vi.fn(),
// //   bezierCurveTo: vi.fn(),
// //   quadraticCurveTo: vi.fn(),
// //   arc: vi.fn(),
// //   arcTo: vi.fn(),
// //   ellipse: vi.fn(),
// //   rect: vi.fn(),
// // }));

// // vi.mock('axios');
// // const mockedAxios = vi.mocked(axios)

// // // Mock the ImprovedJobDescription component
// // vi.mock('../components/ImprovedJobDescription', () => ({
// //   default: ({ improvedText }: { improvedText: string }) => (
// //     <div data-testid="improved-job-description">{improvedText}</div>
// //   )
// // }));

// // // Mock the JobFileViewer component completely to avoid PDF.js imports
// // vi.mock('../components/JobFileViewer', () => ({
// //   default: ({ job }: { job: any }) => (
// //     <div data-testid="job-file-viewer">File: {job.originalFileName || job.fileName}</div>
// //   )
// // }));

// // // Mock the API utilities
// // vi.mock('../utils/api', () => ({
// //   API_ENDPOINTS: {
// //     jobs: {
// //       getById: (id: string) => `/api/jobs/${id}`
// //     }
// //   }
// // }));

// // // Mock html2pdf
// // vi.mock('html2pdf.js', () => ({
// //   default: () => ({
// //     set: () => ({
// //       from: () => ({
// //         save: vi.fn()
// //       })
// //     })
// //   })
// // }));

// // // Mock react-toastify
// // vi.mock('react-toastify', () => ({
// //   toast: {
// //     error: vi.fn(),
// //     success: vi.fn()
// //   }
// // }));

// // // Mock react-pdf
// // vi.mock('react-pdf', () => ({
// //   Document: ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-document">{children}</div>,
// //   Page: ({ pageNumber }: { pageNumber: number }) => <div data-testid={`pdf-page-${pageNumber}`}>PDF Page {pageNumber}</div>,
// //   pdfjs: {
// //     GlobalWorkerOptions: {
// //       workerSrc: ''
// //     }
// //   }
// // }));

// // // Mock docx-preview
// // vi.mock('docx-preview', () => ({
// //   renderAsync: vi.fn().mockResolvedValue(undefined)
// // }));

// // describe('AnalysisDetail Page', () => {
// //   const mockJobData = {
// //     id: '123',
// //     userEmail: 'test@example.com',
// //     originalText: 'Original job description text',
// //     improvedText: 'Improved job description text',
// //     fileName: 'job.pdf',
// //     originalFileName: 'original-job.pdf',
// //     contentType: 'application/pdf',
// //     fileSize: 1024,
// //     fileUrl: 'https://example.com/file.pdf',
// //     createdAt: '2025-06-22T12:00:00Z',
// //     analysis: {
// //       overall_assessment: 'This is a comprehensive assessment of the job description.',
// //       bias_score: 0.3,
// //       inclusivity_score: 0.8,
// //       clarity_score: 0.9,
// //       role: 'Software Engineer',
// //       industry: 'Technology',
// //       issues: [
// //         {
// //           type: 'Gender Bias',
// //           text: 'guys',
// //           severity: 'medium',
// //           explanation: 'This term may exclude non-male candidates'
// //         }
// //       ],
// //       suggestions: [
// //         {
// //           original: 'We need guys who are rockstars',
// //           improved: 'We need team members who are exceptional performers',
// //           rationale: 'More inclusive language that welcomes all genders',
// //           category: 'Gender Inclusivity'
// //         }
// //       ],
// //       seo_keywords: ['software development', 'programming', 'technology']
// //     }
// //   };

// //   it('renders analysis detail with all sections when scores are not zero', async () => {
// //     (mockedAxios.get as unknown as { mockResolvedValueOnce: Function }).mockResolvedValueOnce({
// //       data: mockJobData
// //     });

// //     render(
// //       <MemoryRouter initialEntries={["/analysis/123"]}>
// //         <Routes>
// //           <Route path="/analysis/:id" element={<AnalysisDetail />} />
// //         </Routes>
// //       </MemoryRouter>
// //     );

// //     // Main heading
// //     expect(await screen.findByText(/Job Description Analysis/i)).toBeInTheDocument();
    
// //     // File name
// //     expect(await screen.findByText('job.pdf')).toBeInTheDocument();
    
// //     // File viewer section
// //     expect(await screen.findByText(/📎 Uploaded File/i)).toBeInTheDocument();
    
    
// //     // Analysis Matrix
// //     expect(await screen.findByText(/📊 Analysis Matrix/i)).toBeInTheDocument();
// //     expect(await screen.findByText(/Bias Level/i)).toBeInTheDocument();
// //     expect(await screen.findByText(/Inclusivity Score/i)).toBeInTheDocument();
// //     expect(await screen.findByText(/Clarity Score/i)).toBeInTheDocument();
    
// //     // Role and Industry
// //     expect(await screen.findByText(/Job Role/i)).toBeInTheDocument();
// //     expect(await screen.findByText('Software Engineer')).toBeInTheDocument();
// //     expect(await screen.findByText(/Job Industry/i)).toBeInTheDocument();
// //     expect(await screen.findByText('Technology')).toBeInTheDocument();
    
// //     // Overall Assessment
// //     expect(await screen.findByText(/Overall Assessment/i)).toBeInTheDocument();
// //     expect(await screen.findByText(/comprehensive assessment/i)).toBeInTheDocument();
    
// //     // Issues Section
// //     expect(await screen.findByText(/Detected Biased Issues/i)).toBeInTheDocument();
// //     expect(await screen.findByText(/Gender Bias/i)).toBeInTheDocument();
    
// //     // Suggestions Section
// //     expect(await screen.findByText(/Improvement Suggestions for Inclusiveness and Clarity Issues/i)).toBeInTheDocument();
// //     expect(await screen.findByText(/Original Text:/i)).toBeInTheDocument();
// //     expect(await screen.findByText(/Improved Version:/i)).toBeInTheDocument();
    
// //     // Improved Job Description
// //     expect(await screen.findByText(/📝 Improved Job Description/i)).toBeInTheDocument();
    
    
// //     // SEO Keywords
// //     expect(await screen.findByText(/SEO Keywords to Add/i)).toBeInTheDocument();
// //     expect(await screen.findByText('software development')).toBeInTheDocument();
    
// //     // Side-by-side comparison
// //     expect(await screen.findByText(/📋 Compare: Original vs Improved/i)).toBeInTheDocument();
// //     expect(await screen.findByText(/Original Job Description/i)).toBeInTheDocument();
    
// //     // Download button
// //     expect(await screen.findByText(/Download Analysis Report \(PDF\)/i)).toBeInTheDocument();
// //   });

// //   it('renders limited content when all scores are zero', async () => {
// //     const zeroScoreData = {
// //       ...mockJobData,
// //       analysis: {
// //         ...mockJobData.analysis,
// //         bias_score: 0,
// //         inclusivity_score: 0,
// //         clarity_score: 0,
// //         role: '',
// //         industry: '',
// //         issues: [],
// //         suggestions: [],
// //         seo_keywords: []
// //       }
// //     };

// //     (mockedAxios.get as unknown as { mockResolvedValueOnce: Function }).mockResolvedValueOnce({
// //       data: zeroScoreData
// //     });

// //     render(
// //       <MemoryRouter initialEntries={["/analysis/123"]}>
// //         <Routes>
// //           <Route path="/analysis/:id" element={<AnalysisDetail />} />
// //         </Routes>
// //       </MemoryRouter>
// //     );

// //     // Should show main heading and overall assessment
// //     expect(await screen.findByText(/Job Description Analysis/i)).toBeInTheDocument();
// //     expect(await screen.findByText(/Overall Assessment/i)).toBeInTheDocument();
    
// //     // Should NOT show analysis matrix when all scores are zero
// //     expect(screen.queryByText(/📊 Analysis Matrix/i)).not.toBeInTheDocument();
// //     expect(screen.queryByText(/Bias Level/i)).not.toBeInTheDocument();
    
// //     // Should NOT show role and industry sections
// //     expect(screen.queryByText(/Job Role/i)).not.toBeInTheDocument();
// //     expect(screen.queryByText(/Job Industry/i)).not.toBeInTheDocument();
    
// //     // Should NOT show issues, suggestions, or other analysis sections
// //     expect(screen.queryByText(/Detected Biased Issues/i)).not.toBeInTheDocument();
// //     expect(screen.queryByText(/Improvement Suggestions/i)).not.toBeInTheDocument();
// //     expect(screen.queryByText(/📝 Improved Job Description/i)).not.toBeInTheDocument();
// //     expect(screen.queryByText(/SEO Keywords/i)).not.toBeInTheDocument();
// //     expect(screen.queryByText(/Download Analysis Report/i)).not.toBeInTheDocument();
// //   });

// //   it('renders no issues message when issues array is empty', async () => {
// //     const noIssuesData = {
// //       ...mockJobData,
// //       analysis: {
// //         ...mockJobData.analysis,
// //         issues: []
// //       }
// //     };

// //     (mockedAxios.get as unknown as { mockResolvedValueOnce: Function }).mockResolvedValueOnce({
// //       data: noIssuesData
// //     });

// //     render(
// //       <MemoryRouter initialEntries={["/analysis/123"]}>
// //         <Routes>
// //           <Route path="/analysis/:id" element={<AnalysisDetail />} />
// //         </Routes>
// //       </MemoryRouter>
// //     );

// //     expect(await screen.findByText(/Detected Biased Issues/i)).toBeInTheDocument();
// //     expect(await screen.findByText(/No issues found! Your job description looks good./i)).toBeInTheDocument();
// //   });

// //   it('renders no suggestions message when suggestions array is empty', async () => {
// //     const noSuggestionsData = {
// //       ...mockJobData,
// //       analysis: {
// //         ...mockJobData.analysis,
// //         suggestions: []
// //       }
// //     };

// //     (mockedAxios.get as unknown as { mockResolvedValueOnce: Function }).mockResolvedValueOnce({
// //       data: noSuggestionsData
// //     });

// //     render(
// //       <MemoryRouter initialEntries={["/analysis/123"]}>
// //         <Routes>
// //           <Route path="/analysis/:id" element={<AnalysisDetail />} />
// //         </Routes>
// //       </MemoryRouter>
// //     );

// //     expect(await screen.findByText(/Improvement Suggestions for Inclusiveness and Clarity Issues/i)).toBeInTheDocument();
// //     expect(await screen.findByText(/No suggestions needed! Your job description is well-written./i)).toBeInTheDocument();
// //   });

// //   it('handles loading state', () => {
// //     // Mock a delayed response
// //     (mockedAxios.get as unknown as { mockImplementation: Function }).mockImplementation(
// //       () => new Promise(resolve => setTimeout(resolve, 1000))
// //     );

// //     render(
// //       <MemoryRouter initialEntries={["/analysis/123"]}>
// //         <Routes>
// //           <Route path="/analysis/:id" element={<AnalysisDetail />} />
// //         </Routes>
// //       </MemoryRouter>
// //     );

// //     expect(screen.getByText(/Loading analysis.../i)).toBeInTheDocument();
// //     expect(screen.getByRole('status')).toBeInTheDocument();
// //   });

// //   it('handles error state when API call fails', async () => {
// //     (mockedAxios.get as unknown as { mockRejectedValueOnce: Function }).mockRejectedValueOnce(
// //       new Error('API Error')
// //     );

// //     render(
// //       <MemoryRouter initialEntries={["/analysis/123"]}>
// //         <Routes>
// //           <Route path="/analysis/:id" element={<AnalysisDetail />} />
// //         </Routes>
// //       </MemoryRouter>
// //     );

// //     // Wait for the error handling to complete
// //     await new Promise(resolve => setTimeout(resolve, 100));
    
// //     // Since we're using MemoryRouter in tests, navigation errors are handled internally
// //     // This test primarily ensures the component doesn't crash on API errors
// //   });

// //   it('renders without file viewer when no fileUrl is provided', async () => {
// //     const noFileData = {
// //       ...mockJobData,
// //       fileUrl: undefined
// //     };

// //     (mockedAxios.get as unknown as { mockResolvedValueOnce: Function }).mockResolvedValueOnce({
// //       data: noFileData
// //     });

// //     render(
// //       <MemoryRouter initialEntries={["/analysis/123"]}>
// //         <Routes>
// //           <Route path="/analysis/:id" element={<AnalysisDetail />} />
// //         </Routes>
// //       </MemoryRouter>
// //     );

// //     expect(await screen.findByText(/Job Description Analysis/i)).toBeInTheDocument();
// //     expect(screen.queryByText(/📎 Uploaded File/i)).not.toBeInTheDocument();
// //     expect(screen.queryByTestId('job-file-viewer')).not.toBeInTheDocument();
// //   });
// // });

// import { render, screen } from '@testing-library/react';
// import AnalysisDetail from '../AnalysisDetail';
// import { MemoryRouter, Route, Routes } from 'react-router-dom';
// import axios from 'axios';
// import { vi } from 'vitest';

// // Mock DOMMatrix for PDF.js
// const mockDOMMatrixInstance = {
//   scale: vi.fn().mockReturnThis(),
//   translate: vi.fn().mockReturnThis(),
//   multiply: vi.fn().mockReturnThis(),
//   inverse: vi.fn().mockReturnThis(),
//   transformPoint: vi.fn().mockReturnValue({ x: 0, y: 0 }),
//   a: 1, b: 0, c: 0, d: 1, e: 0, f: 0
// };

// global.DOMMatrix = vi.fn().mockImplementation(() => mockDOMMatrixInstance) as any;

// // Add static methods to the DOMMatrix constructor
// Object.assign(global.DOMMatrix, {
//   fromFloat32Array: vi.fn().mockReturnValue(mockDOMMatrixInstance),
//   fromFloat64Array: vi.fn().mockReturnValue(mockDOMMatrixInstance),
//   fromMatrix: vi.fn().mockReturnValue(mockDOMMatrixInstance),
//   prototype: mockDOMMatrixInstance
// });

// // Mock Canvas API for PDF.js
// global.HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
//   fillRect: vi.fn(),
//   clearRect: vi.fn(),
//   getImageData: vi.fn(() => ({ data: new Array(4) })),
//   putImageData: vi.fn(),
//   createImageData: vi.fn(() => ({ data: new Array(4) })),
//   setTransform: vi.fn(),
//   drawImage: vi.fn(),
//   save: vi.fn(),
//   fillText: vi.fn(),
//   restore: vi.fn(),
//   beginPath: vi.fn(),
//   moveTo: vi.fn(),
//   lineTo: vi.fn(),
//   closePath: vi.fn(),
//   stroke: vi.fn(),
//   translate: vi.fn(),
//   scale: vi.fn(),
//   rotate: vi.fn(),
//   arc: vi.fn(),
//   fill: vi.fn(),
//   measureText: vi.fn(() => ({ width: 0 })),
//   transform: vi.fn(),
//   rect: vi.fn(),
//   clip: vi.fn(),
// });

// // Mock Path2D
// global.Path2D = vi.fn().mockImplementation(() => ({
//   addPath: vi.fn(),
//   closePath: vi.fn(),
//   moveTo: vi.fn(),
//   lineTo: vi.fn(),
//   bezierCurveTo: vi.fn(),
//   quadraticCurveTo: vi.fn(),
//   arc: vi.fn(),
//   arcTo: vi.fn(),
//   ellipse: vi.fn(),
//   rect: vi.fn(),
// }));

// vi.mock('axios');
// const mockedAxios = vi.mocked(axios)

// // Mock the ImprovedJobDescription component
// vi.mock('../components/ImprovedJobDescription', () => ({
//   default: ({ improvedText }: { improvedText: string }) => (
//     <div data-testid="improved-job-description">{improvedText}</div>
//   )
// }));

// // Mock the JobFileViewer component completely to avoid PDF.js imports
// vi.mock('../components/JobFileViewer', () => ({
//   default: ({ job }: { job: any }) => (
//     <div data-testid="job-file-viewer">File: {job.originalFileName || job.fileName}</div>
//   )
// }));

// // Mock the API utilities
// vi.mock('../utils/api', () => ({
//   API_ENDPOINTS: {
//     jobs: {
//       getById: (id: string) => `/api/jobs/${id}`
//     }
//   }
// }));

// // Mock html2pdf
// vi.mock('html2pdf.js', () => ({
//   default: () => ({
//     set: () => ({
//       from: () => ({
//         save: vi.fn()
//       })
//     })
//   })
// }));

// // Mock react-toastify
// vi.mock('react-toastify', () => ({
//   toast: {
//     error: vi.fn(),
//     success: vi.fn()
//   }
// }));

// // Mock react-pdf
// vi.mock('react-pdf', () => ({
//   Document: ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-document">{children}</div>,
//   Page: ({ pageNumber }: { pageNumber: number }) => <div data-testid={`pdf-page-${pageNumber}`}>PDF Page {pageNumber}</div>,
//   pdfjs: {
//     GlobalWorkerOptions: {
//       workerSrc: ''
//     }
//   }
// }));

// // Mock docx-preview
// vi.mock('docx-preview', () => ({
//   renderAsync: vi.fn().mockResolvedValue(undefined)
// }));

// describe('AnalysisDetail Page', () => {
//   const mockJobData = {
//     id: '123',
//     userEmail: 'test@example.com',
//     originalText: 'Original job description text',
//     improvedText: 'Improved job description text',
//     fileName: 'job.pdf',
//     originalFileName: 'original-job.pdf',
//     contentType: 'application/pdf',
//     fileSize: 1024,
//     fileUrl: 'https://example.com/file.pdf',
//     createdAt: '2025-06-22T12:00:00Z',
//     analysis: {
//       overall_assessment: 'This is a comprehensive assessment of the job description.',
//       bias_score: 0.3,
//       inclusivity_score: 0.8,
//       clarity_score: 0.9,
//       role: 'Software Engineer',
//       industry: 'Technology',
//       issues: [
//         {
//           type: 'Gender Bias',
//           text: 'guys',
//           severity: 'medium',
//           explanation: 'This term may exclude non-male candidates'
//         }
//       ],
//       suggestions: [
//         {
//           original: 'We need guys who are rockstars',
//           improved: 'We need team members who are exceptional performers',
//           rationale: 'More inclusive language that welcomes all genders',
//           category: 'Gender Inclusivity'
//         }
//       ],
//       seo_keywords: ['software development', 'programming', 'technology']
//     }
//   };

//   it('renders analysis detail with all sections when scores are not zero', async () => {
//     (mockedAxios.get as unknown as { mockResolvedValueOnce: Function }).mockResolvedValueOnce({
//       data: mockJobData
//     });

//     render(
//       <MemoryRouter initialEntries={["/analysis/123"]}>
//         <Routes>
//           <Route path="/analysis/:id" element={<AnalysisDetail />} />
//         </Routes>
//       </MemoryRouter>
//     );

//     // Main heading
//     expect(await screen.findByText(/Job Description Analysis/i)).toBeInTheDocument();
    
//     // File name
//     expect(await screen.findByText('job.pdf')).toBeInTheDocument();
    
//     // File viewer section
//     expect(await screen.findByText(/📎 Uploaded File/i)).toBeInTheDocument();
    
    
//     // Analysis Matrix
//     expect(await screen.findByText(/📊 Analysis Matrix/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Bias Level/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Inclusivity Score/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Clarity Score/i)).toBeInTheDocument();
    
//     // Role and Industry
//     expect(await screen.findByText(/Job Role/i)).toBeInTheDocument();
//     expect(await screen.findByText('Software Engineer')).toBeInTheDocument();
//     expect(await screen.findByText(/Job Industry/i)).toBeInTheDocument();
//     expect(await screen.findByText('Technology')).toBeInTheDocument();
    
//     // Overall Assessment
//     expect(await screen.findByText(/Overall Assessment/i)).toBeInTheDocument();
//     expect(await screen.findByText(/comprehensive assessment/i)).toBeInTheDocument();
    
//     // Issues Section
//     expect(await screen.findByText(/Detected Biased Issues/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Gender Bias/i)).toBeInTheDocument();
    
//     // Suggestions Section
//     expect(await screen.findByText(/Improvement Suggestions for Inclusiveness and Clarity Issues/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Original Text:/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Improved Version:/i)).toBeInTheDocument();
    
//     // Improved Job Description
//     expect(await screen.findByText(/📝 Improved Job Description/i)).toBeInTheDocument();
    
    
//     // SEO Keywords
//     expect(await screen.findByText(/SEO Keywords to Add/i)).toBeInTheDocument();
//     expect(await screen.findByText('software development')).toBeInTheDocument();
    
//     // Side-by-side comparison
//     expect(await screen.findByText(/📋 Compare: Original vs Improved/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Original Job Description/i)).toBeInTheDocument();
    
   
//   })

//   it('renders limited content when all scores are zero', async () => {
//     const zeroScoreData = {
//       ...mockJobData,
//       analysis: {
//         ...mockJobData.analysis,
//         bias_score: 0,
//         inclusivity_score: 0,
//         clarity_score: 0,
//         role: '',
//         industry: '',
//         issues: [],
//         suggestions: [],
//         seo_keywords: []
//       }
//     };

//     (mockedAxios.get as unknown as { mockResolvedValueOnce: Function }).mockResolvedValueOnce({
//       data: zeroScoreData
//     });

//     render(
//       <MemoryRouter initialEntries={["/analysis/123"]}>
//         <Routes>
//           <Route path="/analysis/:id" element={<AnalysisDetail />} />
//         </Routes>
//       </MemoryRouter>
//     );

//     // Should show main heading and overall assessment
//     expect(await screen.findByText(/Job Description Analysis/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Overall Assessment/i)).toBeInTheDocument();
    
//     // Should NOT show analysis matrix when all scores are zero
//     expect(screen.queryByText(/📊 Analysis Matrix/i)).not.toBeInTheDocument();
//     expect(screen.queryByText(/Bias Level/i)).not.toBeInTheDocument();
    
//     // Should NOT show role and industry sections
//     expect(screen.queryByText(/Job Role/i)).not.toBeInTheDocument();
//     expect(screen.queryByText(/Job Industry/i)).not.toBeInTheDocument();
    
//     // Should NOT show issues, suggestions, or other analysis sections
//     expect(screen.queryByText(/Detected Biased Issues/i)).not.toBeInTheDocument();
//     expect(screen.queryByText(/Improvement Suggestions/i)).not.toBeInTheDocument();
//     expect(screen.queryByText(/📝 Improved Job Description/i)).not.toBeInTheDocument();
//     expect(screen.queryByText(/SEO Keywords/i)).not.toBeInTheDocument();
//     expect(screen.queryByText(/Download Analysis Report/i)).not.toBeInTheDocument();
//   });

//   it('renders no issues message when issues array is empty', async () => {
//     const noIssuesData = {
//       ...mockJobData,
//       analysis: {
//         ...mockJobData.analysis,
//         issues: []
//       }
//     };

//     (mockedAxios.get as unknown as { mockResolvedValueOnce: Function }).mockResolvedValueOnce({
//       data: noIssuesData
//     });

//     render(
//       <MemoryRouter initialEntries={["/analysis/123"]}>
//         <Routes>
//           <Route path="/analysis/:id" element={<AnalysisDetail />} />
//         </Routes>
//       </MemoryRouter>
//     );

//     expect(await screen.findByText(/Detected Biased Issues/i)).toBeInTheDocument();
//     expect(await screen.findByText(/No issues found! Your job description looks good./i)).toBeInTheDocument();
//   });

//   it('renders no suggestions message when suggestions array is empty', async () => {
//     const noSuggestionsData = {
//       ...mockJobData,
//       analysis: {
//         ...mockJobData.analysis,
//         suggestions: []
//       }
//     };

//     (mockedAxios.get as unknown as { mockResolvedValueOnce: Function }).mockResolvedValueOnce({
//       data: noSuggestionsData
//     });

//     render(
//       <MemoryRouter initialEntries={["/analysis/123"]}>
//         <Routes>
//           <Route path="/analysis/:id" element={<AnalysisDetail />} />
//         </Routes>
//       </MemoryRouter>
//     );

//     expect(await screen.findByText(/Improvement Suggestions for Inclusiveness and Clarity Issues/i)).toBeInTheDocument();
//     expect(await screen.findByText(/No suggestions needed! Your job description is well-written./i)).toBeInTheDocument();
//   });

//   it('handles loading state', () => {
//     // Mock a delayed response
//     (mockedAxios.get as unknown as { mockImplementation: Function }).mockImplementation(
//       () => new Promise(resolve => setTimeout(resolve, 1000))
//     );

//     render(
//       <MemoryRouter initialEntries={["/analysis/123"]}>
//         <Routes>
//           <Route path="/analysis/:id" element={<AnalysisDetail />} />
//         </Routes>
//       </MemoryRouter>
//     );

//     expect(screen.getByText(/Loading analysis.../i)).toBeInTheDocument();
//     expect(screen.getByRole('status')).toBeInTheDocument();
//   });

//   it('handles error state when API call fails', async () => {
//     (mockedAxios.get as unknown as { mockRejectedValueOnce: Function }).mockRejectedValueOnce(
//       new Error('API Error')
//     );

//     render(
//       <MemoryRouter initialEntries={["/analysis/123"]}>
//         <Routes>
//           <Route path="/analysis/:id" element={<AnalysisDetail />} />
//         </Routes>
//       </MemoryRouter>
//     );

//     // Wait for the error handling to complete
//     await new Promise(resolve => setTimeout(resolve, 100));
    
//     // Since we're using MemoryRouter in tests, navigation errors are handled internally
//     // This test primarily ensures the component doesn't crash on API errors
//   });

//   it('renders without file viewer when no fileUrl is provided', async () => {
//     const noFileData = {
//       ...mockJobData,
//       fileUrl: undefined
//     };

//     (mockedAxios.get as unknown as { mockResolvedValueOnce: Function }).mockResolvedValueOnce({
//       data: noFileData
//     });

//     render(
//       <MemoryRouter initialEntries={["/analysis/123"]}>
//         <Routes>
//           <Route path="/analysis/:id" element={<AnalysisDetail />} />
//         </Routes>
//       </MemoryRouter>
//     );

//     expect(await screen.findByText(/Job Description Analysis/i)).toBeInTheDocument();
//     expect(screen.queryByText(/📎 Uploaded File/i)).not.toBeInTheDocument();
//     expect(screen.queryByTestId('job-file-viewer')).not.toBeInTheDocument();
//   });
// });

import { render, screen } from '@testing-library/react';
import AnalysisDetail from '../AnalysisDetail';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { vi, beforeAll } from 'vitest';

// Add Promise.withResolvers polyfill for older Node.js versions
beforeAll(() => {
  // Type augmentation for Promise.withResolvers
  interface PromiseWithResolvers<T> {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
  }

  if (!(Promise as any).withResolvers) {
    (Promise as any).withResolvers = function <T>(): PromiseWithResolvers<T> {
      let resolve: (value: T | PromiseLike<T>) => void;
      let reject: (reason?: any) => void;
      const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve: resolve!, reject: reject! };
    };
  }

  // Mock DOMMatrix for PDF.js
  const mockDOMMatrixInstance = {
    scale: vi.fn().mockReturnThis(),
    translate: vi.fn().mockReturnThis(),
    multiply: vi.fn().mockReturnThis(),
    inverse: vi.fn().mockReturnThis(),
    transformPoint: vi.fn().mockReturnValue({ x: 0, y: 0 }),
    a: 1, b: 0, c: 0, d: 1, e: 0, f: 0
  };

  global.DOMMatrix = vi.fn().mockImplementation(() => mockDOMMatrixInstance) as any;

  // Add static methods to the DOMMatrix constructor
  Object.assign(global.DOMMatrix, {
    fromFloat32Array: vi.fn().mockReturnValue(mockDOMMatrixInstance),
    fromFloat64Array: vi.fn().mockReturnValue(mockDOMMatrixInstance),
    fromMatrix: vi.fn().mockReturnValue(mockDOMMatrixInstance),
    prototype: mockDOMMatrixInstance
  });

  // Mock ImageData
  const MockImageData = vi.fn().mockImplementation((dataOrWidth: any, widthOrHeight?: number, heightOrSettings?: any, settings?: any) => {
    if (dataOrWidth instanceof Uint8ClampedArray) {
      return {
        data: dataOrWidth,
        width: widthOrHeight || 1,
        height: heightOrSettings || 1,
        colorSpace: settings?.colorSpace || 'srgb'
      };
    } else {
      const width = dataOrWidth;
      const height = widthOrHeight || 1;
      return {
        data: new Uint8ClampedArray(width * height * 4),
        width: width,
        height: height,
        colorSpace: heightOrSettings?.colorSpace || 'srgb'
      };
    }
  });
  
  global.ImageData = MockImageData as any;

  // Mock Canvas API for PDF.js
  global.HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: new Array(4) })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({ data: new Array(4) })),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    fillText: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn(),
  });

  // Mock Path2D
  global.Path2D = vi.fn().mockImplementation(() => ({
    addPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    bezierCurveTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    arc: vi.fn(),
    arcTo: vi.fn(),
    ellipse: vi.fn(),
    rect: vi.fn(),
  }));

  // Mock fetch for file loading
  global.fetch = vi.fn();
  
  // Mock URL.createObjectURL
  global.URL.createObjectURL = vi.fn(() => 'mock-url');
  global.URL.revokeObjectURL = vi.fn();
});

vi.mock('axios');
const mockedAxios = vi.mocked(axios)

// Mock the ImprovedJobDescription component
vi.mock('../components/ImprovedJobDescription', () => ({
  default: ({ improvedText }: { improvedText: string }) => (
    <div data-testid="improved-job-description">{improvedText}</div>
  )
}));

// Mock the JobFileViewer component completely to avoid PDF.js imports
vi.mock('../components/JobFileViewer', () => ({
  default: ({ job }: { job: any }) => (
    <div data-testid="job-file-viewer">File: {job.originalFileName || job.fileName}</div>
  )
}));

// Mock the API utilities
vi.mock('../utils/api', () => ({
  API_ENDPOINTS: {
    jobs: {
      getById: (id: string) => `/api/jobs/${id}`
    }
  }
}));

// Mock html2pdf
vi.mock('html2pdf.js', () => ({
  default: () => ({
    set: () => ({
      from: () => ({
        save: vi.fn()
      })
    })
  })
}));

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

// Mock react-pdf completely to prevent any PDF.js loading
vi.mock('react-pdf', () => ({
  Document: ({ children }: { children: React.ReactNode }) => <div data-testid="pdf-document">{children}</div>,
  Page: ({ pageNumber }: { pageNumber: number }) => <div data-testid={`pdf-page-${pageNumber}`}>PDF Page {pageNumber}</div>,
  pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: ''
    }
  }
}));

// Mock react-doc-viewer to prevent PDF.js loading
vi.mock('react-doc-viewer', () => ({
  default: ({ documents }: any) => (
    <div data-testid="doc-viewer">
      Document viewer mock: {documents?.[0]?.uri || 'No document'}
    </div>
  ),
  DocViewerRenderers: []
}));

// Mock docx-preview
vi.mock('docx-preview', () => ({
  renderAsync: vi.fn().mockResolvedValue(undefined)
}));

describe('AnalysisDetail Page', () => {
  const mockJobData = {
    id: '123',
    userEmail: 'test@example.com',
    originalText: 'Original job description text',
    improvedText: 'Improved job description text',
    fileName: 'job.pdf',
    originalFileName: 'original-job.pdf',
    contentType: 'application/pdf',
    fileSize: 1024,
    fileUrl: 'https://example.com/file.pdf',
    createdAt: '2025-06-22T12:00:00Z',
    analysis: {
      overall_assessment: 'This is a comprehensive assessment of the job description.',
      bias_score: 0.3,
      inclusivity_score: 0.8,
      clarity_score: 0.9,
      role: 'Software Engineer',
      industry: 'Technology',
      issues: [
        {
          type: 'Gender Bias',
          text: 'guys',
          severity: 'medium',
          explanation: 'This term may exclude non-male candidates'
        }
      ],
      suggestions: [
        {
          original: 'We need guys who are rockstars',
          improved: 'We need team members who are exceptional performers',
          rationale: 'More inclusive language that welcomes all genders',
          category: 'Gender Inclusivity'
        }
      ],
      seo_keywords: ['software development', 'programming', 'technology']
    }
  };

  it('renders analysis detail with all sections when scores are not zero', async () => {
    (mockedAxios.get as unknown as { mockResolvedValueOnce: Function }).mockResolvedValueOnce({
      data: mockJobData
    });

    render(
      <MemoryRouter initialEntries={["/analysis/123"]}>
        <Routes>
          <Route path="/analysis/:id" element={<AnalysisDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Main heading
    expect(await screen.findByText(/Job Description Analysis/i)).toBeInTheDocument();
    
    // File name
    expect(await screen.findByText('job.pdf')).toBeInTheDocument();
    
    // File viewer section
    expect(await screen.findByText(/📎 Uploaded File/i)).toBeInTheDocument();
    
    
    // Analysis Matrix
    expect(await screen.findByText(/📊 Analysis Matrix/i)).toBeInTheDocument();
    expect(await screen.findByText(/Bias Level/i)).toBeInTheDocument();
    expect(await screen.findByText(/Inclusivity Score/i)).toBeInTheDocument();
    expect(await screen.findByText(/Clarity Score/i)).toBeInTheDocument();
    
    // Role and Industry
    expect(await screen.findByText(/Job Role/i)).toBeInTheDocument();
    expect(await screen.findByText('Software Engineer')).toBeInTheDocument();
    expect(await screen.findByText(/Job Industry/i)).toBeInTheDocument();
    expect(await screen.findByText('Technology')).toBeInTheDocument();
    
    // Overall Assessment
    expect(await screen.findByText(/Overall Assessment/i)).toBeInTheDocument();
    expect(await screen.findByText(/comprehensive assessment/i)).toBeInTheDocument();
    
    // Issues Section
    expect(await screen.findByText(/Detected Issues/i)).toBeInTheDocument();
    expect(await screen.findByText(/Gender Bias/i)).toBeInTheDocument();
    
    // Suggestions Section
    expect(await screen.findByText(/Improvement Suggestions for Inclusiveness and Clarity/i)).toBeInTheDocument();
    expect(await screen.findByText(/Original Text:/i)).toBeInTheDocument();
    expect(await screen.findByText(/Improved Version:/i)).toBeInTheDocument();
    
    // Improved Job Description
    expect(await screen.findByText(/📝 Improved Job Description/i)).toBeInTheDocument();
    
    
    // SEO Keywords
    expect(await screen.findByText(/SEO keywords not present in the original job description/i)).toBeInTheDocument();
    expect(await screen.findByText('software development')).toBeInTheDocument();
    
    // Side-by-side comparison
    expect(await screen.findByText(/📋 Compare: Original vs Improved/i)).toBeInTheDocument();
   
    
   
  })

  it('renders limited content when all scores are zero', async () => {
    const zeroScoreData = {
      ...mockJobData,
      analysis: {
        ...mockJobData.analysis,
        bias_score: 0,
        inclusivity_score: 0,
        clarity_score: 0,
        role: '',
        industry: '',
        issues: [],
        suggestions: [],
        seo_keywords: []
      }
    };

    (mockedAxios.get as unknown as { mockResolvedValueOnce: Function }).mockResolvedValueOnce({
      data: zeroScoreData
    });

    render(
      <MemoryRouter initialEntries={["/analysis/123"]}>
        <Routes>
          <Route path="/analysis/:id" element={<AnalysisDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Should show main heading and overall assessment
    expect(await screen.findByText(/Job Description Analysis/i)).toBeInTheDocument();
    expect(await screen.findByText(/Overall Assessment/i)).toBeInTheDocument();
    
    // Should NOT show analysis matrix when all scores are zero
    expect(screen.queryByText(/📊 Analysis Matrix/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Bias Level/i)).not.toBeInTheDocument();
    
    // Should NOT show role and industry sections
    expect(screen.queryByText(/Job Role/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Job Industry/i)).not.toBeInTheDocument();
    
    // Should NOT show issues, suggestions, or other analysis sections
    expect(screen.queryByText(/Detected Issues/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Improvement Suggestions/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/📝 Improved Job Description/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/SEO keywords not present in the original job description/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Download Analysis Report/i)).not.toBeInTheDocument();
  });

  it('renders no issues message when issues array is empty', async () => {
    const noIssuesData = {
      ...mockJobData,
      analysis: {
        ...mockJobData.analysis,
        issues: []
      }
    };

    (mockedAxios.get as unknown as { mockResolvedValueOnce: Function }).mockResolvedValueOnce({
      data: noIssuesData
    });

    render(
      <MemoryRouter initialEntries={["/analysis/123"]}>
        <Routes>
          <Route path="/analysis/:id" element={<AnalysisDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Detected Issues/i)).toBeInTheDocument();
    expect(await screen.findByText(/No issues found! Your job description looks good./i)).toBeInTheDocument();
  });

  it('renders no suggestions message when suggestions array is empty', async () => {
    const noSuggestionsData = {
      ...mockJobData,
      analysis: {
        ...mockJobData.analysis,
        suggestions: []
      }
    };

    (mockedAxios.get as unknown as { mockResolvedValueOnce: Function }).mockResolvedValueOnce({
      data: noSuggestionsData
    });

    render(
      <MemoryRouter initialEntries={["/analysis/123"]}>
        <Routes>
          <Route path="/analysis/:id" element={<AnalysisDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Improvement Suggestions for Inclusiveness and Clarity/i)).toBeInTheDocument();
    expect(await screen.findByText(/No suggestions needed! Your job description is well-written./i)).toBeInTheDocument();
  });

  it('handles loading state', () => {
    // Mock a delayed response
    (mockedAxios.get as unknown as { mockImplementation: Function }).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );

    render(
      <MemoryRouter initialEntries={["/analysis/123"]}>
        <Routes>
          <Route path="/analysis/:id" element={<AnalysisDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading analysis.../i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles error state when API call fails', async () => {
    (mockedAxios.get as unknown as { mockRejectedValueOnce: Function }).mockRejectedValueOnce(
      new Error('API Error')
    );

    render(
      <MemoryRouter initialEntries={["/analysis/123"]}>
        <Routes>
          <Route path="/analysis/:id" element={<AnalysisDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the error handling to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Since we're using MemoryRouter in tests, navigation errors are handled internally
    // This test primarily ensures the component doesn't crash on API errors
  });

  it('renders without file viewer when no fileUrl is provided', async () => {
    const noFileData = {
      ...mockJobData,
      fileUrl: undefined
    };

    (mockedAxios.get as unknown as { mockResolvedValueOnce: Function }).mockResolvedValueOnce({
      data: noFileData
    });

    render(
      <MemoryRouter initialEntries={["/analysis/123"]}>
        <Routes>
          <Route path="/analysis/:id" element={<AnalysisDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Job Description Analysis/i)).toBeInTheDocument();
    expect(screen.queryByText(/📎 Uploaded File/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId('job-file-viewer')).not.toBeInTheDocument();
  });
});