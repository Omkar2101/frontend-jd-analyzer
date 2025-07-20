# Frontend JD Analyzer

A React-based web application that analyzes job descriptions for bias, inclusivity, and clarity. This tool helps HR professionals and recruiters create more ethical, inclusive, and effective job postings.

## 🎯 Project Overview

The Frontend JD Analyzer is a comprehensive system designed to:
- **Detect Bias**: Identifies potential gender bias, racial bias, and ageism in job descriptions
- **Enhance Inclusivity**: Provides suggestions to make job postings more welcoming to diverse candidates
- **Improve Clarity**: Analyzes and suggests improvements for better readability and understanding
- **SEO Optimization**: Recommends keywords to improve job posting visibility
- **Multi-format Support**: Accepts text input, PDF, DOC, DOCX, and image files

## ✨ Features

### 🔍 **Bias Detection**
- Gender bias identification
- Racial bias detection
- Ageism analysis
- Discriminatory language flagging

### 📊 **Comprehensive Analysis**
- **Bias Score**: Measures potential discriminatory content (lower is better)
- **Inclusivity Score**: Evaluates how welcoming the job posting is to diverse candidates
- **Clarity Score**: Assesses readability and comprehension
- **Overall Assessment**: Provides detailed feedback and recommendations

### 📄 **File Support**
- **Text Input**: Direct paste functionality
- **Document Upload**: PDF, DOC, DOCX support
- **Image Processing**: JPG, JPEG, PNG with OCR capability

### 🎨 **User Experience**
- Intuitive interface with Bootstrap styling
- Real-time validation for text input
- Loading states and progress indicators
- Responsive design for all devices

### 📋 **Job Management**
- Save and track analyzed job descriptions
- View analysis history
- Delete unwanted analyses
- Export reports as PDF

## 🛠️ Technology Stack

### **Frontend Technologies**
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development and better code maintainability
- **Redux Toolkit**: State management for analysis results and user data
- **React Router**: Client-side routing and navigation
- **Bootstrap 5**: Responsive UI components and styling
- **Axios**: HTTP client for API communication

### **Development Tools**
- **Vite**: Fast build tool and development server
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting
- **Vitest**: Unit testing framework
- **GitHub Actions**: CI/CD pipeline

### **Additional Libraries**
- **React Toastify**: User notification system
- **Custom Hooks**: Reusable logic for authentication and data fetching

##  Getting Started

### **Prerequisites**
- Node.js (version 18 or higher)
- npm or yarn package manager

### **Installation**

1. **Clone the repository**
git clone https://github.com/Omkar2101/frontend-jd-analyzer.git
cd frontend-jd-analyzer


2. **Install dependencies**
npm install


3. **Set up environment variables**
Create a `.env` file in the root directory:
VITE_API_BASE_URL=http://localhost:5268/api


4. **Start the development server**

5. **Open your browser**
Navigate to `http://localhost:5173`


## 📁 Project Structure

1. `frontend-jd-analyzer/`
   - `public/`
     - `idea.png`
   - `src/`
     - `components/` – Reusable UI components  
       - `LoginPrompt.tsx`
     - `hooks/` – Custom React hooks  
       - `useAuth.ts`
     - `pages/` – Main application pages  
       - `Home.tsx` – Main analysis interface  
       - `Analysis.tsx` – Results display  
       - `JobList.tsx` – Job history  
       - `Login.tsx` – Authentication  
     - `store/` – Redux store configuration  
       - `store.ts`  
       - `resultSlice.ts`
     - `styles/` – Custom CSS styles  
       - `analysis.css`  
       - `Login.css`
     - `utils/` – Utility functions  
       - `api.ts` – API configuration  
       - `storage.ts` – Local storage utilities  
     - `App.tsx` – Main application component
   - `.github/`
     - `workflows/` – CI/CD pipeline  
       - `frontend-ci-cd.yml`
   - `package.json`  
   - `tsconfig.json`  
   - `vite.config.ts`  
   - `README.md`



## 📝 Available Scripts

### **Development**
npm run dev # Start development server
npm run build # Build for production
npm run preview # Preview production build


### **Code Quality**
npm run lint # Run ESLint
npm run lint:fix # Fix ESLint issues
npm run format # Format code with Prettier



### **Testing**
npm run test # Run tests
npm run test:coverage # Run tests with coverage
npm run test:watch # Run tests in watch mode


## 🔧 Configuration

### **Environment Variables**
- `VITE_API_BASE_URL`: Backend API base URL

### **API Endpoints**
The application connects to the following endpoints:
- `POST /api/jobs/analyze` - Analyze text input
- `POST /api/jobs/upload` - Upload and analyze files
- `GET /api/jobs/user/{email}` - Get user's job history
- `DELETE /api/jobs/{id}` - Delete job analysis

## 🎨 User Interface

### **Home Page**
- Toggle between text input and file upload
- Real-time validation for job description text
- Support for multiple file formats
- User authentication prompt

### **Analysis Results**
- Color-coded scoring system
- Detailed issue breakdown
- Improvement suggestions
- SEO keyword recommendations
- Export functionality

### **Job History**
- Grid view of analyzed jobs
- Quick analysis scores overview
- Delete functionality
- Search and filter capabilities

## 🔍 Input Validation

The application includes comprehensive validation:
- **Minimum Length**: 50 characters required
- **Content Quality**: Checks for meaningful job-related content
- **Format Validation**: Ensures proper job description structure
- **File Type Validation**: Supports specific file formats only

## 🚀 Deployment

### **Production Build**
npm run build



### **GitHub Pages Deployment**
The project includes automated deployment to GitHub Pages via GitHub Actions.

### **Custom Server Deployment**
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your web server
3. Configure your web server to serve the `index.html` for all routes

## 🧪 Testing

The project includes comprehensive testing setup:
- Unit tests for components
- Integration tests for user flows
- Coverage reporting
- CI/CD integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🛠️ Support

For support and questions:
- Create an issue in the GitHub repository


---



