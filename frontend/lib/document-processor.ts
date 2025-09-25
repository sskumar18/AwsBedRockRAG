import type { Document, DocumentChunk } from "./types"

export class DocumentProcessor {
  static async processFile(file: File, knowledgeBaseId: string): Promise<Document> {
    const content = await this.extractTextFromFile(file)
    const chunks = this.createChunks(content, file.name)

    const document: Document = {
      id: crypto.randomUUID(),
      knowledgeBaseId,
      filename: file.name,
      content,
      chunks: chunks.map((chunk) => ({
        ...chunk,
        documentId: crypto.randomUUID(),
      })),
      uploadedAt: new Date().toISOString(),
      status: "processing",
      size: file.size,
      type: file.type,
    }

    // Simulate processing delay
    setTimeout(() => {
      document.status = "indexed"
    }, 2000)

    return document
  }

  private static async extractTextFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        resolve(content)
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  private static createChunks(content: string, filename: string): Omit<DocumentChunk, "documentId">[] {
    const chunkSize = 1000
    const overlap = 200
    const chunks: Omit<DocumentChunk, "documentId">[] = []

    for (let i = 0; i < content.length; i += chunkSize - overlap) {
      const chunkContent = content.slice(i, i + chunkSize)
      chunks.push({
        id: crypto.randomUUID(),
        content: chunkContent,
        metadata: {
          startIndex: i,
          endIndex: Math.min(i + chunkSize, content.length),
          section: filename,
        },
      })
    }

    return chunks
  }

  static searchChunks(query: string, chunks: DocumentChunk[], maxResults = 5): DocumentChunk[] {
    // Simple text-based search (in a real app, this would use vector embeddings)
    const queryLower = query.toLowerCase()
    const scored = chunks.map((chunk) => ({
      chunk,
      score: this.calculateRelevanceScore(queryLower, chunk.content.toLowerCase()),
    }))

    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map((item) => item.chunk)
  }

  private static calculateRelevanceScore(query: string, content: string): number {
    const queryWords = query.split(" ").filter((word) => word.length > 2)
    let score = 0

    queryWords.forEach((word) => {
      const matches = (content.match(new RegExp(word, "g")) || []).length
      score += matches
    })

    return score
  }
}
