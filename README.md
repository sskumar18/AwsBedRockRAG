# AWS Bedrock RAG Application

A complete **Retrieval Augmented Generation (RAG)** application built with AWS Bedrock, featuring document management, knowledge base creation, and intelligent chat capabilities.

## 🚀 What It Does

This application allows you to:

- **📚 Create Knowledge Bases**: Organize your documents into searchable knowledge repositories
- **📄 Upload Documents**: Support for PDF, TXT, DOC, and DOCX files with automatic processing
- **🤖 Chat with Documents**: Ask questions and get AI-powered answers based on your uploaded content
- **🔍 Document Search**: Find relevant documents and see source attribution
- **☁️ Cloud Integration**: Seamless integration with AWS Bedrock, S3, and PostgreSQL

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │   AWS Services  │
│   (Next.js)     │◄──►│   (Node.js)      │◄──►│                 │
│                 │    │                 │    │ • Bedrock       │
│ • React UI      │    │ • Express API   │    │ • S3 Storage    │
│ • TypeScript    │    │ • Prisma ORM    │    │ • Knowledge Base│
│ • Tailwind CSS  │    │ • PostgreSQL    │    │ • OpenSearch    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Relational database

### AWS Services
- **AWS Bedrock** - AI/ML service for RAG capabilities
- **AWS S3** - Document storage
- **AWS Bedrock Knowledge Base** - Document indexing and search
- **AWS OpenSearch** - Vector search engine

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **PostgreSQL database**
- **AWS Account** with Bedrock access
- **AWS S3 bucket**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd bedrock-rag
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Set up database
npx prisma generate
npx prisma migrate dev

# Start backend server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
# Edit .env.local with your API URL

# Start frontend server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:9000

## 📋 Environment Configuration

### Backend (.env)
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bedrock_rag"

# AWS Configuration
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Bedrock Knowledge Base
EXISTING_KNOWLEDGE_BASE_ID=your_kb_id
EXISTING_DATA_SOURCE_ID=your_data_source_id

# S3 Configuration
S3_BUCKET_NAME=your_bucket_name
S3_REGION=eu-north-1

# Bedrock Model
BEDROCK_MODEL_ID=eu.anthropic.claude-3-7-sonnet-20250219-v1:0

# API Configuration
PORT=9000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:9000/api/v1
```

## 🎯 Key Features

### 🏠 **Home Dashboard**
- View all knowledge bases
- Create new knowledge bases
- Quick access to management and chat

### 📚 **Knowledge Base Management**
- Create and configure knowledge bases
- Upload multiple document types
- Monitor document processing status
- Delete knowledge bases and documents

### 💬 **Intelligent Chat**
- Chat with your documents using AWS Bedrock
- Toggle between AI responses and document retrieval
- View source attribution for all responses
- Real-time streaming responses

### 📄 **Document Processing**
- Support for PDF, TXT, DOC, DOCX files
- Automatic chunking and indexing
- Progress tracking during upload
- File validation and error handling

## 🔧 API Endpoints

### Knowledge Bases
- `GET /api/v1/knowledge-bases` - List all knowledge bases
- `POST /api/v1/knowledge-bases` - Create knowledge base
- `GET /api/v1/knowledge-bases/:id` - Get knowledge base details
- `DELETE /api/v1/knowledge-bases/:id` - Delete knowledge base

### Documents
- `POST /api/v1/knowledge-bases/:id/documents` - Upload documents
- `GET /api/v1/knowledge-bases/:id/documents` - List documents
- `DELETE /api/v1/documents/:id` - Delete document

### Chat & Search
- `POST /api/v1/knowledge-bases/:id/chat` - Chat with knowledge base
- `POST /api/v1/knowledge-bases/:id/retrieve` - Retrieve documents

## 📁 Project Structure

```
bedrock-rag/
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/    # API controllers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── config/         # Configuration
│   ├── prisma/             # Database schema
│   └── package.json
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── lib/               # Utilities and API client
│   └── package.json
└── README.md              # This file
```

## 🚀 Deployment

### Development
```bash
# Backend
cd backend && npm run dev

# Frontend (in another terminal)
cd frontend && npm run dev
```

### Production
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env
   - Run `npx prisma migrate dev`

2. **AWS Credentials**
   - Verify AWS credentials are correct
   - Check AWS region configuration
   - Ensure S3 bucket exists and is accessible

3. **Bedrock Access**
   - Verify Bedrock is available in your region
   - Check knowledge base and data source IDs
   - Ensure proper AWS permissions

### Health Checks

```bash
# Backend health check
curl http://localhost:9000/health

# Expected response
{"status":"OK","message":"Server is running!"}
```

## 📚 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.
