# Bedrock RAG Backend

A Node.js backend service for AWS Bedrock RAG (Retrieval Augmented Generation) with document upload, knowledge base management, and chat functionality.

## Prerequisites

- Node.js 18+
- PostgreSQL database
- AWS Account with Bedrock access
- AWS S3 bucket

## Environment Setup

### 1. Create `.env` file

Create a `.env` file in the `backend` directory with the following variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/bedrock_rag?schema=public"

# AWS Configuration
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# Existing Knowledge Base Configuration
EXISTING_KNOWLEDGE_BASE_ID=your_knowledge_base_id
EXISTING_DATA_SOURCE_ID=your_data_source_id

# S3 Configuration
S3_BUCKET_NAME=logicaihub
S3_REGION=eu-north-1
S3_BUCKET_ARN=arn:aws:s3:::logicaihub

# Bedrock Model Configuration
BEDROCK_MODEL_ID=eu.anthropic.claude-3-7-sonnet-20250219-v1:0

# API Configuration
FRONTEND_URL=http://localhost:3000
PORT=9000

# Optional: Chunking Configuration
CHUNK_MAX_TOKENS=500
CHUNK_OVERLAP_PERCENTAGE=20
```

### 2. Example `.env` file

```bash
# Database
DATABASE_URL="postgresql://user@localhost:5432/bedrock_rag?schema=public"

# AWS Credentials
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_access_key

# Bedrock Knowledge Base
EXISTING_KNOWLEDGE_BASE_ID=XX2AKVKPIM
EXISTING_DATA_SOURCE_ID=L469ZGRRT3

# S3 Bucket
S3_BUCKET_NAME=logicaihub
S3_REGION=eu-north-1

# Bedrock Model
BEDROCK_MODEL_ID=eu.anthropic.claude-3-7-sonnet-20250219-v1:0

# API
FRONTEND_URL=http://localhost:3000
PORT=9000
```

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up database:**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### Knowledge Bases
- `GET /api/v1/knowledge-bases` - List all knowledge bases
- `GET /api/v1/knowledge-bases/:id` - Get specific knowledge base
- `POST /api/v1/knowledge-bases` - Create knowledge base
- `DELETE /api/v1/knowledge-bases/:id` - Delete knowledge base

### Documents
- `POST /api/v1/knowledge-bases/:id/documents` - Upload documents
- `GET /api/v1/knowledge-bases/:id/documents` - List documents
- `DELETE /api/v1/documents/:id` - Delete document

### Chat
- `POST /api/v1/knowledge-bases/:id/chat` - Chat with knowledge base
- `POST /api/v1/knowledge-bases/:id/retrieve` - Retrieve documents

## Features

- ✅ **Document Upload**: Upload files to S3 with automatic Bedrock sync
- ✅ **Knowledge Base Management**: CRUD operations for knowledge bases
- ✅ **Bedrock RAG**: Chat with documents using AWS Bedrock
- ✅ **Document Search**: Retrieve relevant documents
- ✅ **Source Attribution**: See which documents were used for responses

## AWS Services Used

- **AWS Bedrock**: For RAG and text generation
- **AWS S3**: For document storage
- **AWS Bedrock Knowledge Base**: For document indexing

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check PostgreSQL is running
   - Verify DATABASE_URL is correct
   - Run `npx prisma migrate dev`

2. **AWS Credentials Error**
   - Verify AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
   - Check AWS_REGION is correct
   - Ensure S3 bucket exists and is accessible

3. **Bedrock Knowledge Base Error**
   - Verify EXISTING_KNOWLEDGE_BASE_ID exists
   - Check EXISTING_DATA_SOURCE_ID is correct
   - Ensure Bedrock is available in your region

### Health Check

Test the API is running:
```bash
curl http://localhost:9000/health
```

Expected response:
```json
{"status":"OK","message":"Server is running!"}
```

## Development

### Project Structure
```
backend/
├── src/
│   ├── controllers/     # API controllers
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── config/         # Configuration
│   └── index.ts        # Entry point
├── prisma/
│   └── schema.prisma   # Database schema
├── .env               # Environment variables
└── package.json       # Dependencies
```

### Database Schema
- **KnowledgeBase**: Stores knowledge base metadata
- **Document**: Stores document information and S3 references

## License

MIT License
