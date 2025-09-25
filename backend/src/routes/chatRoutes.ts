import express from 'express';
import { chatWithKnowledgeBase, retrieveDocuments } from '../controllers/chatController';

const router = express.Router();

// Chat with knowledge base (RAG)
router.post('/knowledge-bases/:id/chat', chatWithKnowledgeBase);

// Retrieve documents only (no generation)
router.post('/knowledge-bases/:id/retrieve', retrieveDocuments);

export default router;
