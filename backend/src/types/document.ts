// backend/src/types/document.ts
export interface Document {
  id: string;
  knowledgeBaseId: string;
  filename: string;
  s3Key: string;
  fileType: string;
  fileSize: number;
  status: "processing" | "indexed" | "error";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocumentRequest {
  filename: string;
  s3Key: string;
  fileType: string;
  fileSize: number;
}

export interface DocumentResponse {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadResponse {
  success: boolean;
  data?: {
    documents: DocumentResponse[];
    message: string;
  };
  error?: string;
}
