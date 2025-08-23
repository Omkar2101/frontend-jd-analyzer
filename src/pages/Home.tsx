

// pages/Home.tsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setResult, clearResult } from "../store/resultSlice";
import type { RootState } from "../store/store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import LoginPrompt from "../components/LoginPrompt";
import { API_ENDPOINTS } from '../utils/api';
import { useAuth } from "../hooks/useAuth";
import { handleApiError } from '../utils/errorHandler';

// Text validation function
function validateJobDescriptionText(text: string): { isValid: boolean; error?: string } {
  const trimmedText = text.trim();
  
  // Check minimum length
  if (trimmedText.length < 50) {
    return { 
      isValid: false, 
      error: `Job description must be at least 50 characters long. Current length: ${trimmedText.length} characters` 
    };
  }
  
  // Check for repetitive characters (more than 5 consecutive same characters)
  const repetitivePattern = /(.)\1{5,}/;
  if (repetitivePattern.test(trimmedText)) {
    return { 
      isValid: false, 
      error: "Text contains too many repetitive characters. Please provide a proper job description." 
    };
  }
  
  // Check for excessive special characters
  const specialCharPattern = /[^\w\s.,!?;:()\-'"/]/g;
  const specialCharCount = (trimmedText.match(specialCharPattern) || []).length;
  const specialCharRatio = specialCharCount / trimmedText.length;
  if (specialCharRatio > 0.3) {
    return { 
      isValid: false, 
      error: "Text contains too many special characters. Please provide a valid job description." 
    };
  }
  
  // Check for meaningful words (at least 10 words with 3+ characters)
  const meaningfulWords = trimmedText.split(/\s+/).filter(word => 
    word.replace(/[^\w]/g, '').length >= 3
  );
  if (meaningfulWords.length < 10) {
    return { 
      isValid: false, 
      error: "Please provide a more detailed job description with proper words." 
    };
  }
  
  // Check for common job-related keywords
  const jobKeywords = [
    'job', 'position', 'role', 'responsibilities', 'requirements', 'experience', 
    'skills', 'qualifications', 'candidate', 'work', 'team', 'company', 
    'duties', 'tasks', 'developer', 'manager', 'analyst', 'engineer', 'coordinator',
    "employment", "hiring", "recruit", "apply", "application", "resume", "cv",
    "salary", "benefits", "location", "remote", "office", "department"
  ];
  
  const hasJobKeywords = jobKeywords.some(keyword => 
    trimmedText.toLowerCase().includes(keyword)
  );
  
  if (!hasJobKeywords) {
    return { 
      isValid: false, 
      error: "Text doesn't appear to be a job description. Please provide a valid job posting." 
    };
  }
  
  return { isValid: true };
}

function Home() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [inputMethod, setInputMethod] = useState<'text' | 'file'>('text');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [textValidation, setTextValidation] = useState<{ isValid: boolean; error?: string }>({ isValid: true });
  const [fileValidation, setFileValidation] = useState<{ isValid: boolean; error?: string }>({ isValid: true });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const result = useSelector((state: RootState) => state.result.data);
  
  // Use the auth hook properly
  const { userEmail, isLoading } = useAuth();

  // Clear results when component mounts
  useEffect(() => {
    dispatch(clearResult());
  }, [dispatch]);

  // Validate text on change
  useEffect(() => {
    if (inputMethod === 'text' && text.trim()) {
      const validation = validateJobDescriptionText(text);
      setTextValidation(validation);
    } else {
      setTextValidation({ isValid: true });
    }
  }, [text, inputMethod]);

  // Validate file on change
  useEffect(() => {
    if (inputMethod === 'file' && file) {
      const validation = validateFile(file);
      setFileValidation(validation);
    } else {
      setFileValidation({ isValid: true });
    }
  }, [file, inputMethod]);

  // File validation function
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const allowedTypes = ['.txt', '.doc', '.docx', '.pdf', '.jpg', '.jpeg', '.png'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(fileExtension)) {
      return {
        isValid: false,
        error: `Invalid file type. Allowed types are: ${allowedTypes.join(', ')}`
      };
    }
    
    // Check file size (10MB limit)
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxFileSize) {
      return {
        isValid: false,
        error: 'File size too large. Maximum allowed size is 10MB.'
      };
    }
    
    return { isValid: true };
  };

  // Reset other input when method changes
  const handleInputMethodChange = (method: 'text' | 'file') => {
    setInputMethod(method);
    if (method === 'text') {
      setFile(null);
      setFileValidation({ isValid: true });
    } else {
      setText('');
      setTextValidation({ isValid: true });
    }
    // Clear any previous results when changing input method
    dispatch(clearResult());
  };

  const handleAnalyze = async () => {
    // Check if user is logged in using the hook
    if (!userEmail) {
      setShowLoginPrompt(true);
      return;
    }

    // Validate input before proceeding
    if (inputMethod === 'text') {
      const validation = validateJobDescriptionText(text);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }
    } else if (inputMethod === 'file') {
      if (!file) {
        toast.error('Please select a file to upload');
        return;
      }
      
      const validation = validateFile(file);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }
    }

    try {
      setIsAnalyzing(true);
      // Clear previous results before starting new analysis
      dispatch(clearResult());
      
      let res;
      if (inputMethod === 'text' && text.trim()) {
        // Show a brief loading message for text analysis
        toast.info('Analyzing job description...', { 
          autoClose: 2000, 
          hideProgressBar: true 
        });
        
        res = await axios.post(API_ENDPOINTS.jobs.analyze, { 
          text,
          userEmail 
        }, {
          timeout: 180000 // 180 second timeout
        });
      } else if (inputMethod === 'file' && file) {
        // Show a brief loading message for file analysis
        toast.info('Processing and analyzing file...', { 
          autoClose: 1000, 
          hideProgressBar: true 
        });
        
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userEmail", userEmail); 
        
        res = await axios.post(API_ENDPOINTS.jobs.upload, formData, {
          timeout: 300000, // 5 minute timeout for file uploads
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      } else {
        toast.error('Please provide a job description');
        return;
      }

      // Success handling
      if (res?.data) {
        dispatch(setResult(res.data));
        toast.success('Analysis completed successfully!');
        navigate('/analysis');
      } else {
        toast.error('No data received from analysis. Please try again.');
      }
      
    } catch (error: unknown) {
      // This is where your error handler is used - and it's perfect!
      console.error('Analysis error:', error);
      handleApiError(error);
      
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze = inputMethod === 'text' 
    ? text.trim() && textValidation.isValid 
    : file && fileValidation.isValid;

  // Show loading state while auth is being determined
  if (isLoading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-5">
        <h2 className="mb-4">JD Analyzer</h2>

        <div className="mb-4">
          <div className="btn-group" role="group" aria-label="Input method selection">
            <button
              type="button"
              className={`btn ${inputMethod === 'text' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleInputMethodChange('text')}
            >
              Paste Text
            </button>
            <button
              type="button"
              className={`btn ${inputMethod === 'file' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleInputMethodChange('file')}
            >
              Upload File
            </button>
          </div>
        </div>

        {inputMethod === 'text' ? (
          <div>
            <textarea
              className={`form-control mb-3 ${textValidation.isValid ? '' : 'is-invalid'}`}
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste job description text here"
              disabled={isAnalyzing}
            />
            {!textValidation.isValid && textValidation.error && (
              <div className="invalid-feedback d-block mb-3">
                {textValidation.error}
              </div>
            )}
            <small className="text-muted d-block mb-3">
              Please paste a complete job description with requirements, responsibilities, and qualifications (minimum 50 characters).
            </small>
          </div>
        ) : (
          <div>
            <input
              data-testid="file-input"
              type="file"
              accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png"
              className={`form-control mb-3 ${fileValidation.isValid ? '' : 'is-invalid'}`}
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={isAnalyzing}
            />
            {!fileValidation.isValid && fileValidation.error && (
              <div className="invalid-feedback d-block mb-3">
                {fileValidation.error}
              </div>
            )}
            <small className="text-muted d-block mb-3">
              Accepted file types: .txt, .pdf, .doc, .docx, .jpg, .jpeg, .png (Max size: 10MB)
            </small>
          </div>
        )}

        <button 
          className="btn btn-primary mb-3" 
          onClick={handleAnalyze}
          disabled={isAnalyzing || !canAnalyze}
        >
          {isAnalyzing ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Analyzing...
            </>
          ) : 'Analyze'}
        </button>

        {result && (
          <>
            <pre className="bg-light p-3 border">
              {JSON.stringify(result, null, 2)}
            </pre>
            <button
              className="btn btn-success mt-3"
              onClick={() => navigate("/download")}
            >
              Download Improved JD
            </button>
          </>
        )}
      </div>
      {showLoginPrompt && (
        <LoginPrompt onClose={() => setShowLoginPrompt(false)} />
      )}
    </>
  );
}

export default Home