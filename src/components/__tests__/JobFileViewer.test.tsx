// src/components/__tests__/JobFileViewer.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeAll, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock DOM APIs that PDF.js needs
beforeAll(() => {
  // Mock DOMMatrix with proper constructor signatures
  const MockDOMMatrix = vi.fn().mockImplementation((init?: string | number[]) => ({
    a: 1, b: 0, c: 0, d: 1, e: 0, f: 0,
    multiply: vi.fn().mockReturnThis(),
    translate: vi.fn().mockReturnThis(),
    scale: vi.fn().mockReturnThis()
  }));
  
  // Add static methods using Object.assign to avoid TypeScript errors
  Object.assign(MockDOMMatrix, {
    fromFloat32Array: vi.fn().mockImplementation(() => MockDOMMatrix()),
    fromFloat64Array: vi.fn().mockImplementation(() => MockDOMMatrix()),
    fromMatrix: vi.fn().mockImplementation(() => MockDOMMatrix())
  });
  
  global.DOMMatrix = MockDOMMatrix as any;

  // Mock Path2D
  global.Path2D = vi.fn().mockImplementation(() => ({
    addPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn()
  })) as any;
  
  // Mock ImageData with proper constructor signatures
  const MockImageData = vi.fn().mockImplementation((dataOrWidth: any, widthOrHeight?: number, heightOrSettings?: any, settings?: any) => {
    // Handle both constructor signatures
    if (dataOrWidth instanceof Uint8ClampedArray) {
      // new ImageData(data, width, height?, settings?)
      return {
        data: dataOrWidth,
        width: widthOrHeight || 1,
        height: heightOrSettings || 1,
        colorSpace: settings?.colorSpace || 'srgb'
      };
    } else {
      // new ImageData(width, height, settings?)
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
  
  // Mock fetch for file loading
  global.fetch = vi.fn();
  
  // Mock URL.createObjectURL
  global.URL.createObjectURL = vi.fn(() => 'mock-url');
  global.URL.revokeObjectURL = vi.fn();
});

// Mock the API endpoints module
vi.mock('../utils/api', () => ({
  API_ENDPOINTS: {
    files: {
      viewFile: (filename: string) => `/api/files/view/${filename}`,
      downloadFile: (filename: string) => `http://localhost:5268/api/files/${filename}/view`
    }
  }
}));

// Mock docx-preview
vi.mock('docx-preview', () => ({
  renderAsync: vi.fn().mockResolvedValue(undefined)
}));

// Mock react-pdf completely
vi.mock('react-pdf', () => ({
  Document: ({ children, onLoadSuccess, loading, error }: any) => {
    React.useEffect(() => {
      // Simulate successful PDF load after mounting
      setTimeout(() => {
        if (onLoadSuccess) {
          onLoadSuccess({ numPages: 2 });
        }
      }, 0);
    }, [onLoadSuccess]);

    return (
      <div data-testid="pdf-document">
        {loading && <div data-testid="pdf-loading">{loading}</div>}
        {error && <div data-testid="pdf-error">{error}</div>}
        {children}
      </div>
    );
  },
  Page: ({ pageNumber, onLoadSuccess }: any) => {
    React.useEffect(() => {
      if (onLoadSuccess) {
        onLoadSuccess({ pageNumber });
      }
    }, [onLoadSuccess, pageNumber]);
    
    return <div data-testid={`pdf-page-${pageNumber}`}>PDF Page {pageNumber}</div>;
  },
  pdfjs: {
    GlobalWorkerOptions: { workerSrc: '' },
    version: '3.0.0'
  }
}));

// Mock react-doc-viewer
vi.mock('react-doc-viewer', () => ({
  default: ({ documents }: any) => (
    <div data-testid="doc-viewer">
      Text file content loaded from: {documents?.[0]?.uri || 'No URI'}
    </div>
  ),
  DocViewerRenderers: []
}));

// Import the component after mocks are set up
import JobFileViewer from '../JobFileViewer';

describe('JobFileViewer', () => {
  const mockJobBase = {
    id: '123',
    userEmail: 'test@example.com',
    originalText: 'Original text',
    improvedText: 'Improved text',
    fileName: 'stored-file.txt',
    fileSize: 1024,
    createdAt: '2024-01-01T00:00:00Z',
    analysis: {}
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('No file attached', () => {
    test('shows no file message when fileUrl is missing', () => {
      const job = { ...mockJobBase, fileUrl: undefined };
      
      render(<JobFileViewer job={job} />);
      
      expect(screen.getByText('No file attached')).toBeInTheDocument();
    });

    test('shows no file message when fileUrl is empty', () => {
      const job = { ...mockJobBase, fileUrl: '' };
      
      render(<JobFileViewer job={job} />);
      
      expect(screen.getByText('No file attached')).toBeInTheDocument();
    });
  });

  describe('Image files', () => {
    test('renders image file correctly', () => {
      const job = {
        ...mockJobBase,
        fileUrl: '/uploads/image.jpg',
        originalFileName: 'test-image.jpg',
        contentType: 'image/jpeg'
      };
      
      render(<JobFileViewer job={job} />);
      
      const image = screen.getByAltText('test-image.jpg');
      expect(image).toBeInTheDocument();
      
      // The actual URL construction might be different in your component
      // Check what URL is actually being generated and adjust accordingly
      const expectedUrl = 'http://localhost:5268/api/files/image.jpg/view';
      expect(image).toHaveAttribute('src', expectedUrl);
      expect(screen.getByText(/test-image.jpg • 1.00 KB/)).toBeInTheDocument();
    });

    test('handles different image types', () => {
      const imageTypes = ['image/png', 'image/gif', 'image/webp'];
      
      imageTypes.forEach((contentType) => {
        const job = {
          ...mockJobBase,
          fileUrl: '/uploads/test-image.png',
          originalFileName: 'test.png',
          contentType
        };
        
        const { unmount } = render(<JobFileViewer job={job} />);
        expect(screen.getByAltText('test.png')).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('PDF files', () => {
    test('renders PDF file correctly', async () => {
      const job = {
        ...mockJobBase,
        fileUrl: '/uploads/document.pdf',
        originalFileName: 'test-document.pdf',
        contentType: 'application/pdf'
      };
      
      render(<JobFileViewer job={job} />);
      
      expect(screen.getByTestId('pdf-document')).toBeInTheDocument();
      
      // Wait for the page to load
      await screen.findByTestId('pdf-page-1');
      expect(screen.getByTestId('pdf-page-1')).toBeInTheDocument();
    });

    test('shows PDF file information', async () => {
      const job = {
        ...mockJobBase,
        fileUrl: '/uploads/document.pdf',
        originalFileName: 'test-document.pdf',
        contentType: 'application/pdf',
        fileSize: 2048
      };
      
      render(<JobFileViewer job={job} />);
      
      // Wait for PDF to load and show info
      await screen.findByText(/test-document.pdf • 2.00 KB • 2 pages/);
      expect(screen.getByText(/test-document.pdf • 2.00 KB • 2 pages/)).toBeInTheDocument();
    });
  });

  describe('Text files', () => {
    test('detects txt files by extension', () => {
      const job = {
        ...mockJobBase,
        fileUrl: '/uploads/readme.txt',
        originalFileName: 'readme.txt',
        contentType: undefined // No content type, should detect by extension
      };
      
      render(<JobFileViewer job={job} />);
      
      expect(screen.getByTestId('doc-viewer')).toBeInTheDocument();
    });
  });

  describe('Word documents', () => {
    test('identifies DOCX document correctly', () => {
      const job = {
        ...mockJobBase,
        fileUrl: '/uploads/document.docx',
        originalFileName: 'test-document.docx',
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      };
      
      render(<JobFileViewer job={job} />);
      
      // Should have the DOCX container
      expect(document.querySelector('.docx-container')).toBeInTheDocument();
    });

    test('identifies DOC document correctly', () => {
      const job = {
        ...mockJobBase,
        fileUrl: '/uploads/document.doc',
        originalFileName: 'test-document.doc',
        contentType: 'application/msword'
      };
      
      render(<JobFileViewer job={job} />);
      
      expect(document.querySelector('.docx-container')).toBeInTheDocument();
    });

    test('detects Word files by extension', () => {
      const job = {
        ...mockJobBase,
        fileUrl: '/uploads/document.docx',
        originalFileName: 'document.docx',
        contentType: undefined
      };
      
      render(<JobFileViewer job={job} />);
      
      expect(document.querySelector('.docx-container')).toBeInTheDocument();
    });
  });

  describe('Header content', () => {
    test('does not show content type when no file', () => {
      const job = {
        ...mockJobBase,
        fileUrl: undefined,
        contentType: 'application/pdf'
      };
      
      render(<JobFileViewer job={job} />);
      
      expect(screen.queryByText('application/pdf')).not.toBeInTheDocument();
    });
  });

  describe('File URL parsing', () => {
    test('extracts filename from URL correctly', () => {
      const job = {
        ...mockJobBase,
        fileUrl: '/uploads/subfolder/complex-filename.with.dots.pdf',
        originalFileName: 'My Document.pdf',
        contentType: 'application/pdf'
      };
      
      render(<JobFileViewer job={job} />);
      
      // Should use the extracted filename from URL for API calls
      expect(screen.getByTestId('pdf-document')).toBeInTheDocument();
    });

    test('handles URLs with query parameters', () => {
      const job = {
        ...mockJobBase,
        fileUrl: '/uploads/document.pdf?version=1&token=abc123',
        originalFileName: 'document.pdf',
        contentType: 'application/pdf'
      };
      
      render(<JobFileViewer job={job} />);
      
      expect(screen.getByTestId('pdf-document')).toBeInTheDocument();
    });
  });
});