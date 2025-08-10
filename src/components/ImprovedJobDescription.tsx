
import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js'; // 
import '../styles/ImprovedJobDescription.css';

interface ImprovedJobDescriptionProps {
  improvedText: string;
}

const ImprovedJobDescription: React.FC<ImprovedJobDescriptionProps> = ({ improvedText }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  // Function to get filename from job title
  const getFileName = () => {
    const titleMatch = improvedText.match(/\*\*JOB TITLE:\*\*\s*(.+)/);
    if (titleMatch) {
      const title = titleMatch[1].trim();
      return `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Job_Description.pdf`;
    }
    return 'Improved_Job_Description.pdf';
  };

  // Function to render simple HTML content for PDF
  const renderSimpleHtmlContent = () => {
    const tempDiv = document.createElement('div');
    tempDiv.style.cssText = `
      font-family: 'Times New Roman', serif;
      max-width: 100%;
      margin: 0;
      padding: 20px;
      line-height: 1.4;
      color: #000;
      background: white;
      font-size: 12pt;
    `;

    // Add simple CSS
    const style = document.createElement('style');
    style.textContent = `
      .simple-header { 
        font-size: 16pt; 
        font-weight: bold; 
        margin: 0 0 8pt 0; 
        text-align: center;
        border-bottom: 1pt solid #000;
        padding-bottom: 4pt;
      }
      .simple-section { 
        margin: 12pt 0 8pt 0; 
        font-size: 14pt; 
        font-weight: bold; 
      }
      .simple-content { 
        margin: 4pt 0; 
        text-align: justify;
        font-size: 12pt;
      }
      .simple-list { 
        margin: 4pt 0; 
        padding-left: 20pt; 
      }
      .simple-list li { 
        margin: 2pt 0; 
        font-size: 12pt;
      }
      .simple-meta {
        margin: 8pt 0;
        font-size: 12pt;
      }
      .simple-meta strong {
        font-weight: bold;
      }
    `;
    tempDiv.appendChild(style);

    // Parse the improved text and create simple structure
    const text = improvedText;
    console.log('Rendering improved text:', text);
    
    // Extract job title
    const titleMatch = text.match(/\*\*JOB TITLE:\*\*\s*(.+)/);
    if (titleMatch) {
      const headerDiv = document.createElement('div');
      headerDiv.className = 'simple-header';
      headerDiv.textContent = titleMatch[1].trim();
      tempDiv.appendChild(headerDiv);
    }

    // Extract and display basic info
    const companyMatch = text.match(/\*\*COMPANY:\*\*\s*(.+)/);
    const industryMatch = text.match(/\*\*INDUSTRY:\*\*\s*(.+)/);
    const locationMatch = text.match(/\*\*LOCATION:\*\*\s*(.+)/);
    const employmentMatch = text.match(/\*\*EMPLOYMENT TYPE:\*\*\s*(.+)/);

    if (companyMatch || industryMatch || locationMatch || employmentMatch) {
      const metaDiv = document.createElement('div');
      metaDiv.className = 'simple-meta';
      
      if (companyMatch) {
        metaDiv.innerHTML += `<strong>Company:</strong> ${companyMatch[1].trim()}<br>`;
      }
      if (industryMatch) {
        metaDiv.innerHTML += `<strong>Industry:</strong> ${industryMatch[1].trim()}<br>`;
      }
      if (locationMatch) {
        metaDiv.innerHTML += `<strong>Location:</strong> ${locationMatch[1].trim()}<br>`;
      }
      if (employmentMatch) {
        metaDiv.innerHTML += `<strong>Employment Type:</strong> ${employmentMatch[1].trim()}<br>`;
      }
      
      tempDiv.appendChild(metaDiv);
    }

    // Process sections
   // Process sections
    const sections = [
      { key: 'JOB SUMMARY', title: 'Job Summary' },
      { key: 'KEY RESPONSIBILITIES', title: 'Key Responsibilities' },
      { key: 'OUR IDEAL CANDIDATE', title: 'Our Ideal Candidate' },
      { key: 'PREFERRED QUALIFICATIONS', title: 'Preferred Qualifications' },
      { key: 'REQUIRED SKILLS', title: 'Required Skills' },
      { key: 'WHAT WE OFFER', title: 'What We Offer' },
      { key: 'APPLICATION PROCESS', title: 'Application Process' }
    ];

   sections.forEach(section => {
  // Improved regex pattern that's more flexible
  const regex = new RegExp(`\\*\\*${section.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\*\\*\\s*([\\s\\S]*?)(?=\\*\\*[A-Z][A-Z\\s]+:\\*\\*|$)`, 'i');
  const match = text.match(regex);
  
  if (match) {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'simple-section';
    sectionDiv.textContent = section.title;
    tempDiv.appendChild(sectionDiv);

    const content = match[1].trim();
    
    // Split content into lines and filter empty ones
    const lines = content.split('\n').filter(line => line.trim());
    
    // Check if content has bullet points
    const hasBullets = lines.some(line => line.trim().match(/^[•\-*]/));
    
    if (hasBullets) {
      const ul = document.createElement('ul');
      ul.className = 'simple-list';
      
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.match(/^[•\-*]/)) {
          const li = document.createElement('li');
          li.textContent = trimmed.replace(/^[•\-*]\s*/, '');
          ul.appendChild(li);
        } else if (trimmed.length > 0) {
          // Handle non-bullet text within bullet sections
          const li = document.createElement('li');
          li.textContent = trimmed;
          ul.appendChild(li);
        }
      });
      
      tempDiv.appendChild(ul);
    } else {
      const contentDiv = document.createElement('div');
      contentDiv.className = 'simple-content';
      contentDiv.textContent = content;
      tempDiv.appendChild(contentDiv);
    }
  } else {
    // Debug: Log which sections are not found
    console.log(`Section not found: ${section.key}`);
  }
});

    return tempDiv;
  };

  // Function to generate PDF with proper typing
  const generatePDF = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const tempContent = renderSimpleHtmlContent();
      document.body.appendChild(tempContent);
      
      const options = {
        margin: 0.5,
        filename: getFileName(),
        image: { 
          type: 'jpeg',
          quality: 0.95 
        },
        html2canvas: { 
          scale: 1
        },
        jsPDF: { 
          unit: 'in',
          format: 'a4',
          orientation: 'portrait'
        }
      };

      // Now this should work with your updated type declaration
      const pdfBlob = await html2pdf()
        .set(options)
        .from(tempContent)
        .toPdf()
        .output('blob');
      
      document.body.removeChild(tempContent);
      
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setPdfBlob(pdfBlob);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF preview. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to download PDF
  const downloadPDF = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = getFileName();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    generatePDF();
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [improvedText]);

  return (
    <div className="simple-pdf-container">
      {isGenerating && (
        <div className="simple-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Generating PDF...</span>
          </div>
          <p className="mt-3">Generating PDF preview...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
          <div className="mt-2">
            <button className="btn btn-sm btn-outline-danger" onClick={generatePDF}>
              Try Again
            </button>
          </div>
        </div>
      )}

      {pdfUrl && !isGenerating && !error && (
        <>
        
          
          <div className="simple-pdf-preview">
            <iframe
              src={pdfUrl}
              width="100%"
              height="600px"
              title="Job Description PDF"
              style={{ border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div className="text-center mt-3">
            <small className="text-muted d-block mb-3">
              {getFileName()}
            </small>
            <button
              onClick={downloadPDF}
              className="btn btn-success me-2"
            >
              📄 Download PDF
            </button>
            <button
              onClick={generatePDF}
              className="btn btn-outline-secondary"
            >
              🔄 Regenerate
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ImprovedJobDescription;
