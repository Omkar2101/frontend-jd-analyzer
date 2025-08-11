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

### **Files API Endpoints**
- `GET /files/{storedFileName}` - Get file metadata or information
- `GET /files/{storedFileName}/view` - View file content in browser
- `GET /files/{storedFileName}/download` - Download file

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

# 🐳 Docker Setup Guide for JD Analyzer System

This guide will help you set up the complete JD Analyzer System using Docker. The system consists of three main components:
- Frontend (React)
- Backend (.NET)
- Python LLM Service

## 📋 Prerequisites

Before you begin, make sure you have:
- Docker and Docker Compose installed
- Internet connection for pulling Docker images
- Basic knowledge of terminal/command prompt

## 🌐 Network Setup

First, create a Docker network that will allow all services to communicate:

```bash
docker network create jd-analyzer-network
```

## 🚀 Setting Up Each Service

### 1. Frontend Setup

1. Create the project structure:
```bash
mkdir JD-analyzer-system
cd JD-analyzer-system
mkdir jd-frontend-run
cd jd-frontend-run
```

2. Create a `.env` file:
```env
FRONTEND_PORT=5173
VITE_API_BASE_URL=http://localhost:5268/api
```

3. Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VITE_API_BASE_URL: ${VITE_API_BASE_URL}
    container_name: frontend-jd
    ports:
      - "${FRONTEND_PORT}:80"
    networks:
      - backend-network

networks:
  backend-network:
    name: jd-analyzer-network
    external: true
```

4. Start the frontend:
```bash
docker-compose up -d
```

### 2. Backend Setup

1. Create and enter the backend directory:
```bash
cd ..
mkdir jd-backend-run
cd jd-backend-run
```

2. Create `.env` file:
```env
# API Configuration
API_PORT=5268
ASPNETCORE_ENVIRONMENT=Development

# MongoDB Configuration
MONGO_PORT=27017
MONGO_CONNECTION_STRING=mongodb://mongodb:27017
MONGO_DATABASE_NAME=JobAnalyzerDB
MONGO_COLLECTION_NAME=JobDescriptions

# Python Service Configuration
PYTHON_API_BASE_URL=http://python-llm:8000
PYTHON_API_TIMEOUT=30
```

3. Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  api:
    image: ghcr.io/omkar2101/backend-jd:latest
    container_name: backend-jd
    ports:
      - "${API_PORT}:80"
    env_file:
      - .env
    depends_on:
      - mongodb
    networks:
      - backend-network

  mongodb:
    image: mongo:latest
    container_name: mongodb
    ports:
      - "${MONGO_PORT}:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - backend-network

networks:
  backend-network:
    name: jd-analyzer-network
    external: true

volumes:
  mongodb_data:
```

4. Start the backend:
```bash
docker-compose up -d
```

### 3. Python LLM Service Setup

1. Create and enter the Python service directory:
```bash
cd ..
mkdir jd-python-api-run
cd jd-python-api-run
```

2. Create `.env` file:
```env
# API Configuration
GOOGLE_GEMINI_API_KEY=your_api_key

# Service Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True
LOG_LEVEL=INFO

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5268
```

3. Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  python-llm:
    image: ghcr.io/omkar2101/python-llm-bias-detector:latest
    container_name: python-llm
    ports:
      - "${PORT:-8000}:8000"
    env_file:
      - .env
    networks:
      - backend-network

networks:
  backend-network:
    name: jd-analyzer-network
    external: true
```

4. Start the Python service:
```bash
docker-compose up -d
```

## 🔍 Verifying the Setup

1. Check if all containers are running:
```bash
docker ps
```

2. Test the services:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5268/api/health
- Python Service: http://localhost:8000/docs

## 🛠️ Troubleshooting

1. **Services not connecting?**
   - Verify all services are on the same network:
     ```bash
     docker network inspect jd-analyzer-network
     ```

2. **Container not starting?**
   - Check container logs:
     ```bash
     docker logs <container-name>
     ```

3. **Port conflicts?**
   - Modify the port mappings in `.env` files
   - Ensure no other services are using the same ports

## 📝 Notes

- Always start the backend and Python services before using the frontend
- Use the latest versions of Docker images when available
- Keep your API keys secure and never commit them to version control
- For production deployment, modify the environment variables accordingly

## 🆘 Need Help?

- Check the GitHub issues section
- Contact the development team
- Review service-specific documentation in each repository




