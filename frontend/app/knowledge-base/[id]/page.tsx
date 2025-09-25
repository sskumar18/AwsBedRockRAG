// frontend/app/knowledge-base/[id]/page.tsx
"use client";

import { DocumentList } from "@/components/document-list";
import { FileUploadZone } from "@/components/file-upload-zone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Document } from "@/lib/types";
import {
  ArrowLeft,
  Database,
  MessageSquare,
  Settings,
  Upload,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiService, KnowledgeBase } from "../../../lib/api";

export default function KnowledgeBasePage() {
  const params = useParams();
  const router = useRouter();
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(
    null
  );
  const [documents, setDocuments] = useState<Document[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchKnowledgeBase = async () => {
      try {
        setLoading(true);
        const id = params.id as string;
        const data = await ApiService.getKnowledgeBaseById(id);
        setKnowledgeBase(data);
        const documents:any= await ApiService.getDocuments(id);

        setTotalCount(documents.totalCount);

        // For now, get documents from local storage
        // TODO: Implement document API
        setDocuments(documents.documents);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch knowledge base"
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchKnowledgeBase();
    }
  }, [params.id]);

  const handleFileUpload = async (files: File[]) => {
    if (!knowledgeBase) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Upload files via API
      const result = await ApiService.uploadDocuments(knowledgeBase.id, files);

      console.log('Upload result:', result); // Debug log

      // Handle different response formats
      let uploadedDocuments = [];
      if (Array.isArray(result)) {
        uploadedDocuments = result;
      } else if (result && result.documents) {
        uploadedDocuments = result.documents;
      } else if (result && result.data && result.data.documents) {
        uploadedDocuments = result.data.documents;
      }

      // Update documents list with API response
      setDocuments(prev => [...prev, ...uploadedDocuments]);

      setUploadProgress(100);

      // Show success message
      console.log(`Successfully uploaded ${uploadedDocuments.length} documents`);

    } catch (error) {
      console.error('Error uploading files:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload files');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!knowledgeBase) return;

    try {
      // Delete document via API
      await ApiService.deleteDocument(documentId);

      // Update documents list
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));

      console.log('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete document');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading knowledge base...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!knowledgeBase) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Knowledge Base Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The requested knowledge base could not be found.
          </p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-500";
      case "indexing":
        return "bg-yellow-500";
      case "creating":
        return "bg-blue-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-foreground">
                  {knowledgeBase.name}
                </h1>
                <Badge
                  variant="secondary"
                  className={`${getStatusColor("ready")} text-white`}
                >
                  Ready
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {knowledgeBase.description}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/playground/${knowledgeBase.id}`)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Open Playground
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {totalCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Response Mode
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {knowledgeBase.responseMode}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Top K
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {knowledgeBase.topK}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Uploading Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                {Math.round(uploadProgress)}% complete
              </p>
            </CardContent>
          </Card>
        )}

        {/* File Upload Zone */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>
              Add new documents to your knowledge base. Supported formats: TXT,
              PDF, DOC, DOCX
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploadZone
              onFilesSelected={handleFileUpload}
              disabled={isUploading}
            />
          </CardContent>
        </Card>

        {/* Document List */}
        <Card>
          <CardHeader>
            <CardTitle>Documents ({documents.length})</CardTitle>
            <CardDescription>
              Manage the documents in your knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentList
              documents={documents}
              onDelete={handleDeleteDocument}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
