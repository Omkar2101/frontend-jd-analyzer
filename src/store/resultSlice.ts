import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


// Define the analysis data structure
interface AnalysisData {
  bias_score?: number;
  inclusivity_score?: number;
  clarity_score?: number;
  role?: string;
  industry?: string;
  overall_assessment?: string;
  improved_text?: string;
  issues?: Array<{
    type: string;
    text: string;
    severity: string;
    explanation: string;
  }>;
  suggestions?: Array<{
    original: string;
    improved: string;
    rationale: string;
    category: string;
  }>;
  seo_keywords?: string[];
}
// Define the incoming payload structure (from API)
interface JobAnalysisPayload {
  id?: string;
  _id?: string;
  userEmail?: string;
  originalText?: string;
  improvedText?: string;
  fileName?: string;
  originalFileName?: string;
  storedFileName?: string;
  contentType?: string;
  fileSize?: number;
  filePath?: string;
  fileUrl?: string;
  createdAt?: string;
  updated_jd?: string;
  analysis?: AnalysisData;
}


// Define the normalized data structure for your state
interface NormalizedResultData {
  // Analysis data
  bias_score: number;
  inclusivity_score: number;
  clarity_score: number;
  role: string;
  industry: string;
  overall_assessment: string;
  issues: Array<{
    type: string;
    text: string;
    severity: string;
    explanation: string;
  }>;
  suggestions: Array<{
    original: string;
    improved: string;
    rationale: string;
    category: string;
  }>;
  seo_keywords: string[];
  
  // File information
  fileName: string;
  originalFileName: string;
  storedFileName: string;
  contentType: string;
  fileSize: number;
  filePath: string;
  fileUrl: string | null;
  
  // Text content
  improvedText: string;
  originalText: string;
  
  // Other fields
  id?: string;
  userEmail?: string;
  createdAt?: string;
}
interface ResultState {
  data: NormalizedResultData | null; 
  updatedJD: string
}

const initialState: ResultState = {
  data: null,
  updatedJD: '',
}

export const resultSlice = createSlice({
  name: 'result',
  initialState,
  reducers: {
    setResult: (state, action: PayloadAction<JobAnalysisPayload>) => {
      // Store the full payload, not just analysis
      const fullData = action.payload;
      
      // Create a normalized structure that matches what the component expects
      state.data = {
        // Analysis data
        bias_score: fullData.analysis?.bias_score || 0,
        inclusivity_score: fullData.analysis?.inclusivity_score || 0,
        clarity_score: fullData.analysis?.clarity_score || 0,
        role: fullData.analysis?.role || '',
        industry: fullData.analysis?.industry || '',
        overall_assessment: fullData.analysis?.overall_assessment || '',
        issues: fullData.analysis?.issues || [],
        suggestions: fullData.analysis?.suggestions || [],
        seo_keywords: fullData.analysis?.seo_keywords || [],
        
        // File information - FIXED: Use camelCase properties
        fileName: fullData.fileName || '',
        originalFileName: fullData.originalFileName || '',
        storedFileName: fullData.storedFileName || '',
        contentType: fullData.contentType || '',
        fileSize: fullData.fileSize || 0,
        filePath: fullData.filePath || '',
        
        // Create fileUrl for the component - FIXED: Use correct property
        fileUrl: fullData.fileUrl || (fullData.storedFileName ? `/files/${fullData.storedFileName}` : null),
        
        // Text content - FIXED: Use camelCase
        improvedText: fullData.analysis?.improved_text || fullData.improvedText || '',
        originalText: fullData.originalText || '',
        
        // Other fields - FIXED: Use camelCase
        id: fullData.id || fullData._id,
        userEmail: fullData.userEmail,
        createdAt: fullData.createdAt,
      };
      
      state.updatedJD = fullData.updated_jd || fullData.analysis?.improved_text || '';
    },
    clearResult: (state) => {
      state.data = null;
      state.updatedJD = '';
    },
  },
})

export const { setResult, clearResult } = resultSlice.actions
export default resultSlice.reducer