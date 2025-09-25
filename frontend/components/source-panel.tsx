"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DocumentChunk } from "@/lib/types"
import { FileText, Hash } from "lucide-react"

interface SourcePanelProps {
  sources: DocumentChunk[]
}

export function SourcePanel({ sources }: SourcePanelProps) {
  if (sources.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4" />
            Source Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No sources selected. Send a message to see relevant sources.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4" />
          Source Details ({sources.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto">
        {sources.map((source, index) => (
          <div key={source.id} className="border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                <Hash className="h-3 w-3 mr-1" />
                Chunk {index + 1}
              </Badge>
              {source.metadata.section && (
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">{source.metadata.section}</span>
              )}
            </div>

            <div className="text-sm text-foreground bg-muted/50 rounded p-2 max-h-32 overflow-y-auto">
              {source.content}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {<span>Source {source.metadata.source}</span>}

            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
