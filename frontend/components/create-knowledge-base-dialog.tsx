"use client"

import type React from "react"

import { useState } from "react"
import type { KnowledgeBase } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateKnowledgeBaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateKnowledgeBase: (kb: KnowledgeBase) => void
}

export function CreateKnowledgeBaseDialog({
  open,
  onOpenChange,
  onCreateKnowledgeBase,
}: CreateKnowledgeBaseDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [outputFormat, setOutputFormat] = useState<"chunks" | "summary" | "both">("chunks")
  const [maxResults, setMaxResults] = useState("5")
  const [similarityThreshold, setSimilarityThreshold] = useState("0.7")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const knowledgeBase: KnowledgeBase = {
      id: crypto.randomUUID(),
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "creating",
      fileCount: 0,
      retrievalConfig: {
        outputFormat,
        maxResults: Number.parseInt(maxResults),
        similarityThreshold: Number.parseFloat(similarityThreshold),
      },
    }

    // Simulate creation process
    setTimeout(() => {
      knowledgeBase.status = "ready"
      onCreateKnowledgeBase(knowledgeBase)
    }, 1000)

    onCreateKnowledgeBase(knowledgeBase)

    // Reset form
    setName("")
    setDescription("")
    setOutputFormat("chunks")
    setMaxResults("5")
    setSimilarityThreshold("0.7")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Knowledge Base</DialogTitle>
          <DialogDescription>Set up a new knowledge base to store and query your documents.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter knowledge base name"
              required
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

          <div className="space-y-2">
            <Label htmlFor="output-format">Retrieval Output Format</Label>
            <Select value={outputFormat} onValueChange={(value: any) => setOutputFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chunks">Source Chunks Only</SelectItem>
                <SelectItem value="summary">Summary Only</SelectItem>
                <SelectItem value="both">Both Chunks and Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-results">Max Results</Label>
              <Input
                id="max-results"
                type="number"
                value={maxResults}
                onChange={(e) => setMaxResults(e.target.value)}
                min="1"
                max="20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="similarity-threshold">Similarity Threshold</Label>
              <Input
                id="similarity-threshold"
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Create Knowledge Base
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
