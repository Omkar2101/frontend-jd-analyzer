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
  const [inputMethod, setInputMethod] = useState<'text' | 'file'>('text'); // Track active input method
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

    try {
      let res;
      if (inputMethod === 'text' && text.trim()) {
        res = await axios.post("http://localhost:5268/api/jobs/analyze", { text });
      } else if (inputMethod === 'file' && file) {
        const formData = new FormData();
        formData.append("file", file);
        res = await axios.post("http://localhost:5268/api/jobs/upload", formData);
      } else {
        toast.error('Please provide a job description');
        return;
      }
      
      console.log(res.data.analysis);
      dispatch(setResult(res.data));
    } catch (error) {
      toast.error('Error analyzing JD. Please try again.');
      console.error(error);
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
    </>
  );
}

export default Home;
