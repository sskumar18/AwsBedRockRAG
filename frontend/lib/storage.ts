import type { KnowledgeBase, Document, DocumentChunk } from "./types"

const STORAGE_KEYS = {
  KNOWLEDGE_BASES: "knowledge_bases",
  DOCUMENTS: "documents",
  CHUNKS: "document_chunks",
}

export class LocalStorage {
  static getKnowledgeBases(): KnowledgeBase[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE_BASES)
    return data ? JSON.parse(data) : []
  }

  static saveKnowledgeBase(kb: KnowledgeBase): void {
    if (typeof window === "undefined") return
    const kbs = this.getKnowledgeBases()
    const index = kbs.findIndex((k) => k.id === kb.id)
    if (index >= 0) {
      kbs[index] = kb
    } else {
      kbs.push(kb)
    }
    localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_BASES, JSON.stringify(kbs))
  }

  static deleteKnowledgeBase(id: string): void {
    if (typeof window === "undefined") return
    const kbs = this.getKnowledgeBases().filter((kb) => kb.id !== id)
    localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_BASES, JSON.stringify(kbs))

    // Also delete associated documents
    const docs = this.getDocuments().filter((doc) => doc.knowledgeBaseId !== id)
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs))
  }

  static getDocuments(knowledgeBaseId?: string): Document[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS)
    const docs = data ? JSON.parse(data) : []
    return knowledgeBaseId ? docs.filter((doc: Document) => doc.knowledgeBaseId === knowledgeBaseId) : docs
  }

  static saveDocument(doc: Document): void {
    if (typeof window === "undefined") return
    const docs = this.getDocuments()
    const index = docs.findIndex((d) => d.id === doc.id)
    if (index >= 0) {
      docs[index] = doc
    } else {
      docs.push(doc)
    }
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs))
  }

  static getChunks(documentId?: string): DocumentChunk[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(STORAGE_KEYS.CHUNKS)
    const chunks = data ? JSON.parse(data) : []
    return documentId ? chunks.filter((chunk: DocumentChunk) => chunk.documentId === documentId) : chunks
  }

  static saveChunks(chunks: DocumentChunk[]): void {
    if (typeof window === "undefined") return
    const existingChunks = this.getChunks()
    const updatedChunks = [...existingChunks]

    chunks.forEach((newChunk) => {
      const index = updatedChunks.findIndex((c) => c.id === newChunk.id)
      if (index >= 0) {
        updatedChunks[index] = newChunk
      } else {
        updatedChunks.push(newChunk)
      }
    })

    localStorage.setItem(STORAGE_KEYS.CHUNKS, JSON.stringify(updatedChunks))
  }
}
