import express from "express";
import { createKnowledgeBase, deleteKnowledgeBase, getAllKnowledgeBases, getKnowledgeBaseById } from "../controllers/knowledgeBaseController";

const router = express.Router();

router.get("/", getAllKnowledgeBases);
router.post("/", createKnowledgeBase);
router.delete("/:id", deleteKnowledgeBase);
router.get("/:id", getKnowledgeBaseById);

export default router;
