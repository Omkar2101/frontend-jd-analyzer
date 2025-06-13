// pages/Home.tsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setResult } from "../store/resultSlice";
import type { RootState } from "../store/store";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const result = useSelector((state: RootState) => state.result.data);

  const handleAnalyze = async () => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    else formData.append("text", text);

    const res = await axios.post(
      "http://localhost:5268/api/jobs/upload",
      formData
    );
    console.log(res.data.analysis);

    dispatch(setResult(res.data));
  };

  return (
    <>
      
      <div className="container mt-5">
        <h2 className="mb-4">JD Analyzer</h2>

        <textarea
          className="form-control mb-3"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste job description text here"
        ></textarea>

        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.png"
          className="form-control mb-3"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button className="btn btn-primary mb-3" onClick={handleAnalyze}>
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
    </>
  );
}

export default Home;
