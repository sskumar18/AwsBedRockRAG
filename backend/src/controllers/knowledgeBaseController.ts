import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getAllKnowledgeBases = async (req: Request, res: Response) => {
  try {

    const knowledgeBases = await prisma.knowledgeBase.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        responseMode: true,
        topK: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: knowledgeBases
    });
  } catch (error) {
    console.error('Error fetching knowledge bases:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch knowledge bases',
      details: error.message
    });
  }
};

export const createKnowledgeBase = async (req: Request, res: Response) => {
  try {
    const { name, description, responseMode, topK } = req.body;
    const knowledgeBase = await prisma.knowledgeBase.create({
      data: {
        name,
        description,
        responseMode,
        topK
      }
    });
    res.json({
      success: true,
      data: knowledgeBase
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      error: 'Failed to create knowledge base',
      details: error.message
    });
  }
};

export const deleteKnowledgeBase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if knowledge base exists
    const existingKB = await prisma.knowledgeBase.findUnique({
      where: { id },
    });

    if (!existingKB) {
      return res.status(404).json({
        success: false,
        error: "Knowledge base not found",
      });
    }

    // Delete the knowledge base
    await prisma.knowledgeBase.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Knowledge base deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting knowledge base:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete knowledge base",
      details: error.message,
    });
  }
};

export const getKnowledgeBaseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const knowledgeBase = await prisma.knowledgeBase.findUnique({
      where: { id },
    });
    res.json({
      success: true,
      data: knowledgeBase
    });
  } catch (error) {
    console.error("Error fetching knowledge base by id:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch knowledge base by id",
      details: error.message,
    });
  }
};
