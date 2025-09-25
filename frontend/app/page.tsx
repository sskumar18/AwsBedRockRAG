// frontend/app/page.tsx
"use client";

import { KnowledgeBaseList } from "@/components/knowledge-base-list";
import { Button } from "@/components/ui/button";
import { ApiService, KnowledgeBase } from "@/lib/api";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getKnowledgeBases();
        setKnowledgeBases(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch knowledge bases"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledgeBases();
  }, []);

  const handleDeleteKnowledgeBase = async (id: string) => {
    try {
      // TODO: Implement delete API call
      console.log("Delete knowledge base:", id);
      // Refresh the list
      const data = await ApiService.getKnowledgeBases();
      setKnowledgeBases(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete knowledge base"
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-background h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading knowledge bases...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background h-full">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Your Knowledge Bases
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your document collections
            </p>
          </div>
          <Button
            onClick={() => router.push("/create")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>

        <KnowledgeBaseList
          knowledgeBases={knowledgeBases}
          setKnowledgeBases={setKnowledgeBases}
          setError={setError}
        />
      </div>
    </div>
  );
}
