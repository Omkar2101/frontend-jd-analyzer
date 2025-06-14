// pages/Home.tsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setResult } from "../store/resultSlice";
import type { RootState } from "../store/store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import LoginPrompt from "../components/LoginPrompt";

function isLoggedIn() {
  return !!localStorage.getItem('userEmail');
}

function Home() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [inputMethod, setInputMethod] = useState<'text' | 'file'>('text');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const result = useSelector((state: RootState) => state.result.data);

  // Reset other input when method changes
  const handleInputMethodChange = (method: 'text' | 'file') => {
    setInputMethod(method);
    if (method === 'text') {
      setFile(null);
    } else {
      setText('');
    }
  };

  const handleAnalyze = async () => {
    if (!isLoggedIn()) {
      setShowLoginPrompt(true);
      return;
    }

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      toast.error('Please log in first');
      return;
    }

    try {
      setIsLoading(true);
      let res;
      if (inputMethod === 'text' && text.trim()) {
        res = await axios.post("http://localhost:5268/api/jobs/analyze", { 
          text,
          userEmail 
        });
      } else if (inputMethod === 'file' && file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userEmail", userEmail);
        res = await axios.post("http://localhost:5268/api/jobs/upload", formData);
      } else {
        toast.error('Please provide a job description');
        return;
      }
      
      dispatch(setResult(res.data));
      navigate('/result');
    } catch (error: any) {
      const errorMessage = error.response?.data || 'Error analyzing JD. Please try again.';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!isLoggedIn()) {
      setShowLoginPrompt(true);
      return;
    }

    const userEmail = localStorage.getItem('userEmail');
    
    try {
      setIsLoading(true); // Start loading
      
      if (inputMethod === 'file' && file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userEmail', userEmail || '');

        const response = await axios.post('http://localhost:5155/api/jobs/upload', formData);
        dispatch(setResult(response.data));
        navigate('/result');
      } else if (inputMethod === 'text' && text) {
        // For text input, create a blob and send as file
        const blob = new Blob([text], { type: 'text/plain' });
        const textFile = new File([blob], 'input.txt', { type: 'text/plain' });
        
        const formData = new FormData();
        formData.append('file', textFile);
        formData.append('userEmail', userEmail || '');

        const response = await axios.post('http://localhost:5155/api/jobs/upload', formData);
        dispatch(setResult(response.data));
        navigate('/result');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading file');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

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
          <textarea
            className="form-control mb-3"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste job description text here"
          />
        ) : (
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.png"
            className="form-control mb-3"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        )}

        <button 
          className="btn btn-primary mb-3" 
          onClick={handleAnalyze}
          disabled={inputMethod === 'text' ? !text.trim() : !file}
        >
          Analyze
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
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-700">Analyzing Job Description...</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
