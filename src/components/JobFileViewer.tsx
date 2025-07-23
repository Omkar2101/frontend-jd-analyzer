


// src/components/JobFileViewer.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { API_ENDPOINTS } from '../utils/api';
import { renderAsync } from 'docx-preview';
import { Document, Page, pdfjs } from 'react-pdf';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface JobResponse {
  id: string;
  userEmail: string;
  originalText: string;
  improvedText: string;
  fileName: string;
  originalFileName?: string;
  contentType?: string;
  fileSize: number;
  fileUrl?: string;
  createdAt: string;
  analysis: any;
}

interface JobFileViewerProps {
  job: JobResponse;
}

const JobFileViewer: React.FC<JobFileViewerProps> = ({ job }) => {
  // DOCX states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const docxContainerRef = useRef<HTMLDivElement>(null);

  // PDF states
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.0);

  // TXT file states
  const [txtError, setTxtError] = useState<string | null>(null);

  const getStoredFileName = () => {
    if (!job.fileUrl) return null;
    const parts = job.fileUrl.split('/');
    return parts[parts.length - 1];
  };

  // Check if file is TXT
  const isTxtFile = (contentType?: string, filename?: string): boolean => {
    return (
      contentType === 'text/plain' ||
      filename?.toLowerCase().endsWith('.txt') ||
      false
    );
  };

  // Prepare documents array for TXT files only
  const txtDocuments = useMemo(() => {
    const storedFileName = getStoredFileName();
    if (!storedFileName || !isTxtFile(job.contentType, job.originalFileName)) {
      return [];
    }

    return [{
      uri: API_ENDPOINTS.files.viewFile(storedFileName),
      fileType: 'txt'
    }];
  }, [job.fileUrl, job.contentType, job.originalFileName]);

  const loadDocxFile = async () => {
    const storedFileName = getStoredFileName();
    if (!storedFileName || !docxContainerRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch the DOCX file as blob
      const response = await fetch(API_ENDPOINTS.files.viewFile(storedFileName));
      
      if (!response.ok) {
        throw new Error(`Failed to load document: ${response.statusText}`);
      }

      const blob = await response.blob();
      
      // Clear the container
      docxContainerRef.current.innerHTML = '';
      
      // Render the DOCX file
      await renderAsync(blob, docxContainerRef.current, docxContainerRef.current, {
        className: 'docx',
        inWrapper: true,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false,
        breakPages: true,
        ignoreLastRenderedPageBreak: false,
        experimental: false,
        trimXmlDeclaration: true,
        useBase64URL: false,
        renderHeaders: true,
        renderFooters: true,
        renderFootnotes: true,
        renderEndnotes: true,
        debug: false
      });

      console.log('DOCX rendered successfully');
    } catch (err) {
      console.error('Error loading DOCX:', err);
      setError(err instanceof Error ? err.message : 'Failed to load document');
    } finally {
      setIsLoading(false);
    }
  };

  // PDF event handlers
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setPdfLoading(false);
    setPdfError(null);
    console.log('PDF loaded successfully with', numPages, 'pages');
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setPdfError('Failed to load PDF document');
    setPdfLoading(false);
  };

  const onPageLoadSuccess = (page: any) => {
    console.log('Page loaded successfully:', page.pageNumber);
  };

  const onPageLoadError = (error: Error) => {
    console.error('Error loading page:', error);
  };

  // Navigation functions
  const goToPrevPage = () => {
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages || 1));
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= (numPages || 1)) {
      setPageNumber(page);
    }
  };

  // Zoom functions
  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const resetZoom = () => setScale(1.0);

  // TXT error handler
  const handleTxtError = (error: any) => {
    console.error('TXT file viewer error:', error);
    setTxtError('Failed to load text file');
  };

  useEffect(() => {
    if (job.contentType?.includes('word')) {
      loadDocxFile();
    }
  }, [job.fileUrl]);

  const renderFilePreview = () => {
    const storedFileName = getStoredFileName();
    
    if (!job.fileUrl || !storedFileName) {
      return (
        <div className="p-4 border rounded bg-light text-center">
          <i className="bi bi-file-text" style={{ fontSize: '2rem', color: '#6c757d' }}></i>
          <p className="mt-2 mb-0 text-muted">No file attached</p>
        </div>
      );
    }

    const isImage = job.contentType?.startsWith('image/');
    const isPdf = job.contentType === 'application/pdf';
    const isWord = job.contentType?.includes('word') || 
                   job.contentType?.includes('officedocument') ||
                   job.originalFileName?.endsWith('.doc') ||
                   job.originalFileName?.endsWith('.docx');
    const isTxt = isTxtFile(job.contentType, job.originalFileName);

    // For TXT files - use react-doc-viewer
    if (isTxt) {
      return (
        <div>
          

          {txtError && (
            <div className="alert alert-warning mb-3">
              <i className="bi bi-exclamation-triangle me-2"></i>
              <strong>Text Viewer Error</strong>
              <br />
              {txtError}
              <div className="mt-2">
                <button 
                  className="btn btn-sm btn-outline-warning me-2"
                  onClick={() => setTxtError(null)}
                >
                  Try Again
                </button>
                <a 
                  href={API_ENDPOINTS.files.downloadFile(storedFileName)}
                  className="btn btn-sm btn-outline-primary"
                  download={job.originalFileName}
                >
                  <i className="bi bi-download me-1"></i>
                  Download File
                </a>
              </div>
            </div>
          )}

          <div 
            className="txt-viewer-container border rounded"
            style={{ 
              minHeight: '400px',
              backgroundColor: '#f8f9fa'
            }}
          >
            <DocViewer
              documents={txtDocuments}
              pluginRenderers={DocViewerRenderers}
              config={{
                header: {
                  disableHeader: false,
                  disableFileName: false,
                  retainURLParams: true
                }
              }}
              theme={{
                primary: "#28a745",
                secondary: "#ffffff", 
                tertiary: "#f8f9fa",
                text_primary: "#ffffff",
                text_secondary: "#28a745",
                text_tertiary: "#6c757d",
                disableThemeScrollbar: false
              }}
              style={{ 
                height: '400px',
                border: 'none'
              }}
            />
          </div>

         

          <div className="mt-2 text-center">
            <small className="text-muted">
              Text file loaded successfully using react-doc-viewer
            </small>
          </div>
        </div>
      );
    }

    // For images - always show inline
    if (isImage) {
      return (
        <div className="text-center">
          <img 
            src={API_ENDPOINTS.files.viewFile(storedFileName)}
            alt={job.originalFileName || 'Uploaded image'}
            className="img-fluid rounded border"
            style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain' }}
            onError={(e) => {
              console.error('Error loading image:', e);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="mt-3">
            <small className="text-muted">
              {job.originalFileName} • {(job.fileSize / 1024).toFixed(2)} KB
            </small>
          </div>
        </div>
      );
    }

    // For PDFs - use react-pdf
    if (isPdf) {
      return (
        <div>
          

          
          {/* PDF Viewer Container */}
          <div 
            className="pdf-viewer-container border rounded"
            style={{ 
              maxHeight: '700px', 
              overflowY: 'auto',
              backgroundColor: '#f5f5f5',
              padding: '20px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Document
              file={API_ENDPOINTS.files.viewFile(storedFileName)}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading PDF...</span>
                  </div>
                  <p className="mt-3 mb-0">Loading PDF document...</p>
                </div>
              }
              error={
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Failed to load PDF</strong>
                  <br />
                  <small>Please try downloading the file or contact support if the issue persists.</small>
                  <div className="mt-2">
                    <a 
                      href={API_ENDPOINTS.files.downloadFile(storedFileName)}
                      className="btn btn-sm btn-outline-primary"
                      download={job.originalFileName}
                    >
                      <i className="bi bi-download me-1"></i>
                      Download PDF
                    </a>
                  </div>
                </div>
              }
              options={{
                cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
                standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
              }}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                onLoadSuccess={onPageLoadSuccess}
                onLoadError={onPageLoadError}
                onRenderError={onPageLoadError}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="pdf-page"
              />
            </Document>
          </div>

          {/* PDF Info */}
          <div className="mt-3 text-center">
            <small className="text-muted">
              {job.originalFileName} • {(job.fileSize / 1024).toFixed(2)} KB
              {numPages && ` • ${numPages} pages`}
            </small>
          </div>
        </div>
      );
    }

    // For Word documents - use docx-preview
    if (isWord) {
      return (
        <div>
          {isLoading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading document...</span>
              </div>
              <p className="mt-2">Loading document preview...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              <strong>Failed to load document preview</strong>
              <br />
              {error}
              <div className="mt-2">
                <button 
                  className="btn btn-sm btn-outline-danger me-2" 
                  onClick={loadDocxFile}
                >
                  Try Again
                </button>
                
              </div>
            </div>
          )}

          {/* DOCX Container */}
          <div 
            ref={docxContainerRef}
            className="border rounded p-3 bg-white"
            style={{ 
              minHeight: '400px',
              maxHeight: '800px',
              overflowY: 'auto',
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          />

         
        </div>
      );
    }

    // For other file types
    return (
      <div className="p-4 border rounded bg-light">
        <div className="text-center mb-3">
          <i 
            className="bi bi-file-earmark-text"
            style={{ fontSize: '3rem', color: '#6c757d' }}
          ></i>
        </div>
        <div className="text-center">
          <h6 className="mb-2">{job.originalFileName}</h6>
          <p className="text-muted mb-3">
            Size: {(job.fileSize / 1024).toFixed(2)} KB
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <a 
              href={API_ENDPOINTS.files.downloadFile(storedFileName)}
              className="btn btn-primary btn-sm"
              download={job.originalFileName}
            >
              <i className="bi bi-download me-1"></i>
              Download File
            </a>
            <a 
              href={API_ENDPOINTS.files.viewFile(storedFileName)}
              className="btn btn-outline-secondary btn-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-eye me-1"></i>
              Try View
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="job-file-viewer">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0">
          <i className="bi bi-paperclip me-2"></i>
          Original Uploaded File
        </h6>
        {job.fileUrl && (
          <small className="text-muted">
            {job.contentType}
          </small>
        )}
      </div>
      {renderFilePreview()}
    </div>
  );
};

export default JobFileViewer;

