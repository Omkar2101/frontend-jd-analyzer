// pages/Home.tsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setResult, clearResult } from "../store/resultSlice";
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const result = useSelector((state: RootState) => state.result.data);

  // Clear results when component mounts
  useEffect(() => {
    dispatch(clearResult());
  }, [dispatch]);

  // Reset other input when method changes
  const handleInputMethodChange = (method: 'text' | 'file') => {
    setInputMethod(method);
    if (method === 'text') {
      setFile(null);
    } else {
      setText('');
    }
    // Clear any previous results when changing input method
    dispatch(clearResult());
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
      setIsAnalyzing(true);
      // Clear previous results before starting new analysis
      dispatch(clearResult());
      
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
        setIsAnalyzing(false);
        return;
      }
      dispatch(setResult(res.data));
      navigate('/analysis');    } catch (error: any) {
      const errorMessage = error.response?.data || 'Error analyzing JD. Please try again.';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsAnalyzing(false);
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
          />        ) : (
          <div>
            <input
              type="file"              accept=".txt,.pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="form-control mb-3"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <small className="text-muted d-block mb-3">
              Accepted file types: .txt, .pdf, .doc, .docx, .jpg, .jpeg, .png
            </small>
          </div>
        )}<button 
          className="btn btn-primary mb-3" 
          onClick={handleAnalyze}
          disabled={isAnalyzing || (inputMethod === 'text' ? !text.trim() : !file)}
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

export default Home;
