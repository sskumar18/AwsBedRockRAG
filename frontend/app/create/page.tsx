// frontend/app/create/page.tsx
"use client";

import { FileUploadZone } from "@/components/file-upload-zone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { RetrievalConfig } from "@/lib/types";
import { ArrowLeft, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiService } from "../../lib/api";

export default function CreateKnowledgeBasePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [retrievalConfig, setRetrievalConfig] = useState<RetrievalConfig>({
    maxResults: 5,
    similarityThreshold: 0.7,
    responseMode: "llm",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) return;

    setIsCreating(true);
    setError(null);

    try {
      // Create knowledge base via API (JSON request)
      const createdKB = await ApiService.createKnowledgeBase(
        name.trim(),
        description.trim(),
        retrievalConfig.responseMode === "llm"
          ? "LLM Response"
          : "Retrieval Response",
        retrievalConfig.maxResults
      );

      // Upload documents separately (FormData request)
      if (files.length > 0) {
        await ApiService.uploadDocuments(createdKB.id, files);
      }

      // Redirect to the knowledge base page
      router.push(`/knowledge-base/${createdKB.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create knowledge base"
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-background h-full">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Create Knowledge Base
            </h1>
            <p className="text-muted-foreground mt-1">
              Set up a new knowledge base with your documents
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Basic settings for your knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter knowledge base name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this knowledge base contains"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <Label>Retrieval Settings</Label>

                <div className="space-y-2">
                  <Label htmlFor="maxResults" className="text-sm">
                    Max Results
                  </Label>
                  <Select
                    value={retrievalConfig.maxResults.toString()}
                    onValueChange={(value) =>
                      setRetrievalConfig((prev) => ({
                        ...prev,
                        maxResults: Number.parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responseMode" className="text-sm">
                    Response Mode
                  </Label>
                  <Select
                    value={retrievalConfig.responseMode}
                    onValueChange={(value: "retrieval" | "llm") =>
                      setRetrievalConfig((prev) => ({
                        ...prev,
                        responseMode: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retrieval">Retrieval Only</SelectItem>
                      <SelectItem value="llm">LLM Response</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                Add files to your knowledge base (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploadZone
                onFilesSelected={setFiles}
                acceptedTypes={[".txt", ".pdf", ".doc", ".docx",".html"]}
                maxFiles={50}
              />
              {files.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {files.length} files selected:
                  </p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="text-xs text-muted-foreground flex items-center gap-2"
                      >
                        <Upload className="h-3 w-3" />
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || isCreating}
            className="min-w-32"
          >
            {isCreating ? "Creating..." : "Create Knowledge Base"}
          </Button>
        </div>
      </div>
    </div>
  );
}
