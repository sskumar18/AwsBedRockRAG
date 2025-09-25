# Bedrock RAG Frontend

A Next.js frontend application for AWS Bedrock RAG (Retrieval Augmented Generation) with document management, knowledge base chat, and playground functionality.

## Prerequisites

- Node.js 18+
- Backend API running on port 9000
- Modern web browser

## Environment Setup

### 1. Create `.env.local` file

Create a `.env.local` file in the `frontend` directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:9000/api/v1

# Optional: Custom API URL for production
# NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
```

### 2. Example `.env.local` file

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:9000/api/v1
```

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Open in browser:**
```
http://localhost:3000
```

## Features

### 🏠 **Home Page**
- List all knowledge bases
- Create new knowledge bases
- Delete knowledge bases
- Navigate to management and playground

### 📚 **Knowledge Base Management**
- View knowledge base details
- Upload documents (PDF, TXT, DOC, DOCX)
- List uploaded documents
- Delete documents
- Real-time sync status

### 💬 **Playground Chat**
- Chat with documents using Bedrock RAG
- Toggle between AI chat and document retrieval
- View source attribution
- Real-time responses from Bedrock

### 🔧 **Document Management**
- Drag & drop file upload
- Progress tracking
- File type validation
- Automatic Bedrock sync

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx                    # Home page
│   ├── create/
│   │   └── page.tsx              # Create knowledge base
│   ├── knowledge-base/
│   │   └── [id]/
│   │       └── page.tsx          # Knowledge base details
│   └── playground/
│       └── [id]/
│           └── page.tsx          # Chat playground
├── components/
│   ├── ui/                       # UI components
│   ├── chat-message.tsx          # Chat message component
│   ├── document-list.tsx         # Document list
│   ├── file-upload-zone.tsx      # File upload
│   ├── knowledge-base-list.tsx   # KB list
│   └── source-panel.tsx           # Source attribution
├── lib/
│   ├── api.ts                    # API service
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Utilities
└── public/                       # Static assets
```

## API Integration

### Backend Requirements
- Backend API must be running on port 9000
- CORS enabled for `http://localhost:3000`
- All API endpoints available

### API Service
The frontend uses `ApiService` class for all backend communication:

```typescript
// Knowledge Base operations
ApiService.getKnowledgeBases()
ApiService.createKnowledgeBase(name, description, responseMode, topK)
ApiService.deleteKnowledgeBase(id)

// Document operations
ApiService.uploadDocuments(knowledgeBaseId, files)
ApiService.getDocuments(knowledgeBaseId)
ApiService.deleteDocument(documentId)

// Chat operations
ApiService.chatWithKnowledgeBase(knowledgeBaseId, message, maxResults)
ApiService.retrieveDocuments(knowledgeBaseId, query, maxResults)
```

## Usage

### 1. **Create Knowledge Base**
1. Go to home page
2. Click "Create Knowledge Base"
3. Fill in name and description
4. Choose response mode (LLM Response or Retrieval Response)
5. Set max results (Top K)
6. Optionally upload documents
7. Click "Create"

### 2. **Upload Documents**
1. Go to knowledge base page
2. Drag & drop files or click upload zone
3. Files upload to S3 automatically
4. Bedrock sync starts automatically
5. View upload progress and status

### 3. **Chat with Documents**
1. Go to playground page
2. Toggle "Retrieval Only" for document search
3. Toggle "Show Sources" to see source attribution
4. Type your question
5. Get AI responses from Bedrock

### 4. **Manage Documents**
1. View all uploaded documents
2. See file details (size, type, status)
3. Delete documents if needed
4. Monitor sync status

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Radix UI** - UI components

### Key Components

- **ChatMessageComponent** - Renders chat messages with sources
- **SourcePanel** - Shows document sources and metadata
- **FileUploadZone** - Drag & drop file upload
- **KnowledgeBaseList** - Lists knowledge bases with actions

## Troubleshooting

### Common Issues

1. **API Connection Error**
   - Check backend is running on port 9000
   - Verify `NEXT_PUBLIC_API_URL` in `.env.local`
   - Check browser console for CORS errors

2. **File Upload Issues**
   - Check file size (max 50MB)
   - Verify file types (PDF, TXT, DOC, DOCX)
   - Check backend S3 configuration

3. **Chat Not Working**
   - Verify Bedrock Knowledge Base is synced
   - Check documents are uploaded and processed
   - Check browser console for API errors

### Debug Mode

Enable debug logging:
```bash
# Add to .env.local
NEXT_PUBLIC_DEBUG=true
```

## Production Deployment

### Environment Variables
```bash
# Production .env.local
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
```

### Build for Production
```bash
npm run build
npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Features Overview

### 🎯 **Core Functionality**
- ✅ Knowledge Base Management
- ✅ Document Upload & Sync
- ✅ Bedrock RAG Chat
- ✅ Source Attribution
- ✅ Real-time Status Updates

### 🎨 **UI/UX Features**
- ✅ Responsive Design
- ✅ Drag & Drop Upload
- ✅ Loading States
- ✅ Error Handling
- ✅ Progress Tracking

### 🔧 **Technical Features**
- ✅ TypeScript Support
- ✅ API Integration
- ✅ File Type Validation
- ✅ CORS Handling
- ✅ Error Boundaries

## License

MIT License
