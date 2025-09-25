export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  responseMode: 'LLM Response' | 'Retrieval Response';
  topK: number;
}
