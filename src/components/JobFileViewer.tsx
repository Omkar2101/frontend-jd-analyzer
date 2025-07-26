

// src/components/JobFileViewer.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { API_ENDPOINTS } from '../utils/api';
import { renderAsync } from 'docx-preview';
import { Document, Page, pdfjs } from 'react-pdf';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import '../styles/JobFileViewer.css'

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
        <div className="no-file-container">
          <div className="no-file-icon">📄</div>
          <p className="no-file-text">No file attached</p>
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
            <div className="error-container">
              <div className="error-title">⚠️ Text Viewer Error</div>
              <div>{txtError}</div>
              <div className="error-actions">
                <button 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => setTxtError(null)}
                >
                  Try Again
                </button>
                <a 
                  href={API_ENDPOINTS.files.downloadFile(storedFileName)}
                  className="btn btn-sm btn-outline-primary"
                  download={job.originalFileName}
                >
                  📥 Download File
                </a>
              </div>
            </div>
          )}

          <div className="txt-viewer-container">
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
              className="txt-viewer-wrapper"
            />
          </div>

          <div className="txt-success-message">
            Text file loaded successfully using react-doc-viewer
          </div>
        </div>
      );
    }

    // For images - always show inline
    if (isImage) {
      return (
        <div className="image-container">
          <img 
            src={API_ENDPOINTS.files.viewFile(storedFileName)}
            alt={job.originalFileName || 'Uploaded image'}
            className="image-preview"
            onError={(e) => {
              console.error('Error loading image:', e);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="image-info">
            {job.originalFileName} • {(job.fileSize / 1024).toFixed(2)} KB
          </div>
        </div>
      );
    }

    // For PDFs - use react-pdf
    if (isPdf) {
      return (
        <div>
          <div className="pdf-viewer-container">
            <Document
              file={API_ENDPOINTS.files.viewFile(storedFileName)}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p className="loading-text">Loading PDF document...</p>
                </div>
              }
              error={
                <div className="error-container">
                  <div className="error-title">⚠️ Failed to load PDF</div>
                  <div>Please try downloading the file or contact support if the issue persists.</div>
                  <div className="error-actions">
                    <a 
                      href={API_ENDPOINTS.files.downloadFile(storedFileName)}
                      className="btn btn-sm btn-outline-primary"
                      download={job.originalFileName}
                    >
                      📥 Download PDF
                    </a>
                  </div>
                </div>
              }
              options={{
                cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
                standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
              }}
            >
              {/* Render all pages */}
          {numPages && Array.from(new Array(numPages), (el, index) => (
            <div key={`page_${index + 1}`} className="pdf-page-wrapper">
              
              <Page
                pageNumber={index + 1}
                onLoadSuccess={onPageLoadSuccess}
                onLoadError={onPageLoadError}
                onRenderError={onPageLoadError}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="pdf-page"
              />
            </div>
          ))}
        
            </Document>
          </div>

          <div className="pdf-info">
            {job.originalFileName} • {(job.fileSize / 1024).toFixed(2)} KB
            {numPages && ` • ${numPages} pages`}
          </div>
        </div>
      );
    }

    // For Word documents - use docx-preview
    if (isWord) {
      return (
        <div>
          {isLoading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Loading document preview...</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <div className="error-title">⚠️ Failed to load document preview</div>
              <div>{error}</div>
              <div className="error-actions">
                <button 
                  className="btn btn-sm btn-outline-danger" 
                  onClick={loadDocxFile}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          <div 
            ref={docxContainerRef}
            className="docx-container"
          />
        </div>
      );
    }

    // For other file types
    return (
      <div className="generic-file-container">
        <div className="generic-file-icon">📄</div>
        <h6 className="generic-file-title">{job.originalFileName}</h6>
        <p className="generic-file-size">
          Size: {(job.fileSize / 1024).toFixed(2)} KB
        </p>
        <div className="generic-file-actions">
          <a 
            href={API_ENDPOINTS.files.downloadFile(storedFileName)}
            className="btn btn-primary btn-sm"
            download={job.originalFileName}
          >
             Download File
          </a>
          <a 
            href={API_ENDPOINTS.files.viewFile(storedFileName)}
            className="btn btn-outline-secondary btn-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
             Try View
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="job-file-viewer">
     
      {renderFilePreview()}
    </div>
  );
};

export default JobFileViewer;
