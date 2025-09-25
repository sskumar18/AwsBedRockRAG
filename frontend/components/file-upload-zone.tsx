"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { File, Upload, X } from "lucide-react"
import { useCallback, useRef, useState } from "react"

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}

export function FileUploadZone({ onFilesSelected, disabled }: FileUploadZoneProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!disabled) {
        setIsDragActive(true)
      }
    },
    [disabled],
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragActive(false)

      if (disabled) return

      const files = Array.from(e.dataTransfer.files).filter((file) => {
        const validTypes = [
          "text/plain",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]
        return validTypes.includes(file.type) || file.name.endsWith(".txt")
      })

      if (files.length > 0) {
        setSelectedFiles((prev) => [...prev, ...files])
      }
    },
    [disabled],
  )

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files])
    }
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles)
      setSelectedFiles([])
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".txt,.pdf,.doc,.docx,.html"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />
        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        {isDragActive ? (
          <p className="text-lg text-foreground">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-lg text-foreground mb-2">Drag & drop files here, or click to select</p>
            <p className="text-sm text-muted-foreground">Supports TXT, PDF, DOC, DOCX files</p>
          </div>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Selected Files ({selectedFiles.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <Button onClick={handleUpload} disabled={disabled} className="w-full">
            Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? "s" : ""}
          </Button>
        </div>
      )}
    </div>
  )
}
