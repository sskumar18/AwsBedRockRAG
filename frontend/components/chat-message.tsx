"use client"

import type { ChatMessage, DocumentChunk } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Bot, FileText } from "lucide-react"

interface ChatMessageProps {
  message: ChatMessage
  onSourceClick: (sources: DocumentChunk[]) => void
}

export function ChatMessageComponent({ message, onSourceClick }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-3 max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        {/* Message Content */}
        <div className={`rounded-lg p-3 ${isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
          <div className="whitespace-pre-wrap text-sm">{message.content}</div>

          {/* Sources */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/20">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-3 w-3" />
                <span className="text-xs font-medium">Sources ({message.sources.length})</span>
                {message.retrievalOnly && (
                  <Badge variant="secondary" className="text-xs">
                    Retrieval Only
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSourceClick(message.sources!)}
                className="text-xs h-6"
              >
                View Source Details
              </Button>
            </div>
          )}

          {/* Timestamp */}
          <div className="text-xs opacity-70 mt-2">{new Date(message.timestamp).toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  )
}
