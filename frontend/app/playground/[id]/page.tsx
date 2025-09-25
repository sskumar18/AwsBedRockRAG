"use client"

import type React from "react"

import { ChatMessageComponent } from "@/components/chat-message"
import { SourcePanel } from "@/components/source-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ApiService } from "@/lib/api"
import type { ChatMessage, DocumentChunk, KnowledgeBase } from "@/lib/types"
import { ArrowLeft, MessageSquare, Search, Send } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

// Helper function to extract filename from S3 URI
const extractFilename = (s3Uri: string): string => {
  if (!s3Uri) return 'Unknown source'
  const parts = s3Uri.split('/')
  return parts[parts.length - 1] || 'Unknown source'
}

export default function PlaygroundPage() {
  const params = useParams()
  const router = useRouter()
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBase | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [retrievalOnly, setRetrievalOnly] = useState(false)
  const [showSources, setShowSources] = useState(true)
  const [selectedSources, setSelectedSources] = useState<DocumentChunk[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchKnowledgeBase = async () => {
      try {
        const id = params.id as string
        const kb = await ApiService.getKnowledgeBaseById(id)
        setKnowledgeBase(kb)
      } catch (error) {
        console.error('Error fetching knowledge base:', error)
      }
    }

    if (params.id) {
      fetchKnowledgeBase()
    }
  }, [params.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !knowledgeBase || isLoading) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsLoading(true)

    try {
      let responseContent: string
      let sources: any = null

      if (retrievalOnly) {
        // Use retrieve API for document search only
        const retrieveResponse = await ApiService.retrieveDocuments(
          knowledgeBase.id,
          currentInput,
          5
        )

        responseContent = retrieveResponse.results.length > 0
          ? `Found ${retrieveResponse.results.length} relevant documents:\n\n${retrieveResponse.results
              .map((result, index) => `**Document ${index + 1}:**\n${result.content}`)
              .join("\n\n")}`
          : "No relevant information found in the knowledge base."

        sources = retrieveResponse
        // Convert retrieve results to DocumentChunk format
        const documentChunks = retrieveResponse.results.map((result, index) => ({
          id: `retrieve-${index}`,
          content: result.content,
          score: result.score,
          metadata: {
            source: extractFilename(result.location.uri || ''),
            section: 'Retrieved document',
            ...result.metadata
          }
        }))
        setSelectedSources(documentChunks)
      } else {
        // Use chat API for RAG with Bedrock
        const chatResponse = await ApiService.chatWithKnowledgeBase(
          knowledgeBase.id,
          currentInput,
          5
        )

        responseContent = chatResponse.message
        sources = chatResponse

        // Convert Bedrock citations to DocumentChunk format
        const documentChunks = chatResponse.sources.flatMap(citation =>
          citation.retrievedReferences?.map((ref, index) => ({
            id: `bedrock-${index}`,
            content: ref.content || '',
            score: ref.score || 0,
            metadata: {
              source: extractFilename(ref.location.uri || ''),
              section: 'Bedrock reference'
            }
          })) || []
        )
        setSelectedSources(documentChunks)
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date().toISOString(),
        sources: sources,
        retrievalOnly,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error processing message:", error)
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!knowledgeBase) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Knowledge Base Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested knowledge base could not be found.</p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push(`/knowledge-base/${knowledgeBase.id}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to KB
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{knowledgeBase.name} - Playground</h1>
              <p className="text-muted-foreground">Chat with your knowledge base</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="retrieval-mode" checked={retrievalOnly} onCheckedChange={setRetrievalOnly} />
              <Label htmlFor="retrieval-mode" className="text-sm">
                Retrieval Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="show-sources" checked={showSources} onCheckedChange={setShowSources} />
              <Label htmlFor="show-sources" className="text-sm">
                Show Sources
              </Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Chat Area */}
          <div className={`${showSources ? "lg:col-span-3" : "lg:col-span-4"} flex flex-col`}>
            <Card className="flex-1 flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat
                  {retrievalOnly && <span className="text-sm font-normal text-muted-foreground">(Retrieval Only)</span>}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">Start a conversation</h3>
                      <p className="text-muted-foreground">
                        Ask questions about your documents or search for specific information
                      </p>
                    </div>
                  )}
                  {messages.map((message) => (
                    <ChatMessageComponent key={message.id} message={message} onSourceClick={setSelectedSources} />
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-sm text-muted-foreground">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about your knowledge base..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Source Panel */}
          {showSources && (
            <div className="lg:col-span-1">
              <SourcePanel sources={selectedSources} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
