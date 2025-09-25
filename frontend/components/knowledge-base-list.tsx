// frontend/components/knowledge-base-list.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiService, KnowledgeBase } from "@/lib/api";
import { MessageSquare, Settings, Trash2 } from "lucide-react";

interface KnowledgeBaseListProps {
  knowledgeBases: KnowledgeBase[];
  setKnowledgeBases: (knowledgeBases: KnowledgeBase[]) => void;
  setError: (error: string) => void;
}


const deleteKnowledgeBase = async (id: string, setKnowledgeBases: (knowledgeBases: KnowledgeBase[]) => void, setError: (error: string) => void) => {
  try {
    await ApiService.deleteKnowledgeBase(id);
    const data = await ApiService.getKnowledgeBases();
    setKnowledgeBases(data);
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Failed to delete knowledge base"
    );
  }
};

export function KnowledgeBaseList({
  knowledgeBases,
  setKnowledgeBases,
  setError,
}: KnowledgeBaseListProps) {
  if (knowledgeBases.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <MessageSquare className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No knowledge bases yet</h3>
          <p>Create your first knowledge base to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {knowledgeBases.map((kb) => (
        <Card key={kb.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{kb.name}</CardTitle>
            <CardDescription>{kb.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{kb.responseMode}</Badge>
                <span className="text-sm text-muted-foreground">
                  Top K: {kb.topK}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Created: {new Date(kb.createdAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    (window.location.href = `/knowledge-base/${kb.id}`)
                  }
                  className="flex-1"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    (window.location.href = `/playground/${kb.id}`)
                  }
                  className="flex-1"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteKnowledgeBase(kb.id, setKnowledgeBases, setError)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
