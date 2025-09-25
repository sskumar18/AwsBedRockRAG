const API_BASE_URL = 'http://localhost:9000/api/v1';

export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  responseMode: string;
  topK: number;
}

export interface Document {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentsResponse {
  documents: Document[];
  totalCount: number;
  message: string;
}

export interface ChatResponse {
  message: string;
  sources: Array<{
    retrievedReferences: Array<{
      content: string;
      location: any;
      score: number;
    }>;
  }>;
  sessionId: string;
  knowledgeBaseId: string;
  timestamp: string;
}

export interface RetrieveResponse {
  query: string;
  results: Array<{
    content: string;
    location: any;
    score: number;
    metadata: any;
  }>;
  knowledgeBaseId: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ApiService {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {};
    if (options?.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        ...headers,
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return response.json();
  }

  static async getKnowledgeBases(): Promise<KnowledgeBase[]> {
    const response = await this.request<ApiResponse<KnowledgeBase[]>>('/knowledge-bases');
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch knowledge bases');
    }
    return response.data!;
  }

  static async getKnowledgeBaseById(id: string): Promise<KnowledgeBase> {
    const response = await this.request<ApiResponse<KnowledgeBase>>(`/knowledge-bases/${id}`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch knowledge base');
    }
    return response.data!;
  }

  static async createKnowledgeBase(name: string, description: string, responseMode: string, topK: number): Promise<KnowledgeBase> {
    const response = await this.request<ApiResponse<KnowledgeBase>>('/knowledge-bases', {
      method: 'POST',
      body: JSON.stringify({ name, description, responseMode, topK })
    });
    if (!response.success) {
      throw new Error(response.error || 'Failed to create knowledge base');
    }
    return response.data!;
  }

  static async deleteKnowledgeBase(id: string): Promise<void> {
    const response = await this.request<ApiResponse<null>>(`/knowledge-bases/${id}`, {
      method: 'DELETE'
    });
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete knowledge base');
    }
  }

  static async uploadDocuments(id: string, files: File[]): Promise<Document[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch(`${API_BASE_URL}/knowledge-bases/${id}/documents`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload error:', errorText);
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Failed to upload documents");
    }
    return result.data.documents || [];
  }

  static async getDocuments(knowledgeBaseId: string): Promise<DocumentsResponse> {
    const response = await this.request<ApiResponse<DocumentsResponse>>(`/knowledge-bases/${knowledgeBaseId}/documents`);
    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch documents');
    }
    return response.data!;
  }

  static async deleteDocument(documentId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete document');
    }
  }

  // Chat with knowledge base
  static async chatWithKnowledgeBase(knowledgeBaseId: string, message: string, maxResults: number = 5): Promise<ChatResponse> {
    const response = await this.request<ApiResponse<ChatResponse>>(`/knowledge-bases/${knowledgeBaseId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message, maxResults })
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to chat with knowledge base');
    }
    return response.data!;
  }

  // Retrieve documents only
  static async retrieveDocuments(knowledgeBaseId: string, query: string, maxResults: number = 5): Promise<RetrieveResponse> {
    const response = await this.request<ApiResponse<RetrieveResponse>>(`/knowledge-bases/${knowledgeBaseId}/retrieve`, {
      method: 'POST',
      body: JSON.stringify({ query, maxResults })
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to retrieve documents');
    }
    return response.data!;
  }
}
