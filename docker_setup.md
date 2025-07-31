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
Clone the repo using command:git clone https://github.com/Omkar2101/frontend-jd-analyzer.git


1. Create the project structure:
```bash
mkdir JD-analyzer-system
cd JD-analyzer-system
mkdir jd-frontend-run
cd jd-frontend-run
```

- Clone the repo in the jd-frontend-run folder using command:git clone https://github.com/Omkar2101/frontend-jd-analyzer.git
- In the same folder create the .env file

2. Create a `.env` file:
```env
FRONTEND_PORT=5173
VITE_API_BASE_URL=http://localhost:5268/api
```
- Create it if its not already created
- Just paste the below code in the compose file 
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

