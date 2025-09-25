// backend/src/routes/documentRoutes.ts
import express from "express";
import {
  deleteDocument,
  getDocuments,
  upload,
  uploadDocuments,
} from "../controllers/documentController";

const router = express.Router();

// Upload documents to knowledge base
router.post(
  "/knowledge-bases/:id/documents",
  upload.array("files", 10),
  uploadDocuments
);

// Get documents for knowledge base
router.get("/knowledge-bases/:id/documents", getDocuments);

// Delete a document
router.delete("/documents/:id", deleteDocument);

export default router;
