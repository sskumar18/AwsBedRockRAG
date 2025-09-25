"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Document } from "@/lib/types"
import { Clock, FileText, Trash2 } from "lucide-react"

interface DocumentListProps {
  documents: Document[]
  onDelete: (documentId: string) => void
}

export function DocumentList({ documents, onDelete }: DocumentListProps) {
  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "indexed":
        return "bg-green-500"
      case "processing":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No documents uploaded</h3>
        <p className="text-muted-foreground">Upload your first document to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <div
          key={document.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center gap-3 flex-1">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">
                {document.filename}
              </h4>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span>{formatFileSize(document.fileSize)}</span>
                {/* <span>{document.chunks.length} chunks</span> */}
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(document.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant="secondary"
              className={`${getStatusColor(document.status)} text-white`}
            >
              {document.status}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(document.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
