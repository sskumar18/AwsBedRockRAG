export interface KnowledgeBase {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  status: "creating" | "indexing" | "ready" | "error"
  fileCount: number
  retrievalConfig: {
    outputFormat: "chunks" | "summary" | "both"
    maxResults: number
    similarityThreshold: number
  }
}

export interface Document {
  id: string;
  knowledgeBaseId: string;
  filename: string;
  content: string;
  createdAt: string;
  status: "processing" | "indexed" | "error";
  fileSize: number;
  fileType: string;
}

export interface DocumentChunk {
  id: string
  documentId: string
  content: string
  metadata: {
    page?: number
    section?: string
    startIndex: number
    endIndex: number
    source: string
  }
  embedding?: number[]
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  sources?: DocumentChunk[]
  retrievalOnly?: boolean
}

export interface RetrievalResult {
  chunks: DocumentChunk[]
  query: string
  timestamp: string
}
