// backend/src/controllers/documentController.ts
import { StartIngestionJobCommand } from '@aws-sdk/client-bedrock-agent';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import multer from 'multer';
import { bedrockAgentClient, bedrockKBConfig } from '../config/aws';
import { S3Service } from '../services/s3Service';

const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/html'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only TXT, PDF, DOC, DOCX files are allowed.'));
    }
  }
});

export const uploadDocuments = async (req: Request, res: Response) => {
  try {
    const { id: knowledgeBaseId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files provided'
      });
    }

    // Upload files to S3 and create database records
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const s3Key = S3Service.generateFileKey(knowledgeBaseId, file.originalname);
        await S3Service.uploadFile(s3Key, file.buffer, file.mimetype);

        const document = await prisma.document.create({
          data: {
            knowledgeBaseId,
            filename: file.originalname,
            s3Key,
            fileType: file.mimetype,
            fileSize: file.size,
            status: 'uploaded'
          }
        });

        return {
          id: document.id,
          filename: document.filename,
          fileType: document.fileType,
          fileSize: document.fileSize,
          status: document.status,
          createdAt: document.createdAt,
          updatedAt: document.updatedAt
        };
      })
    );

    // Sync with your existing Bedrock Knowledge Base
    try {
      console.log(`Starting sync with Bedrock KB: ${bedrockKBConfig.knowledgeBaseId}...`);

      const command = new StartIngestionJobCommand({
        knowledgeBaseId: bedrockKBConfig.knowledgeBaseId,
        dataSourceId: bedrockKBConfig.dataSourceId,
        description: `Sync job started at ${new Date().toISOString()}`
      });

      const response = await bedrockAgentClient.send(command);
      console.log(`Sync started: ${response.ingestionJob?.ingestionJobId}`);

      // Update all documents to 'syncing' status
      await prisma.document.updateMany({
        where: { knowledgeBaseId },
        data: { status: 'syncing' }
      });

    } catch (syncError) {
      console.error('Error starting sync:', syncError);
      // Don't fail the upload if sync fails
    }

    res.json({
      success: true,
      data: {
        documents: uploadResults,
        message: `Successfully uploaded ${uploadResults.length} documents and started sync with Bedrock KB ${bedrockKBConfig.knowledgeBaseId}`
      }
    });
  } catch (error) {
    console.error('Error uploading documents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload documents',
      details: error.message
    });
  }
};

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const { id: knowledgeBaseId } = req.params;
    const [documents, totalCount] = await Promise.all([
      prisma.document.findMany({
        where: { knowledgeBaseId },
        select: {
          id: true,
          filename: true,
          fileType: true,
          fileSize: true,
          status: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.document.count({ where: { knowledgeBaseId } })
    ]);

    res.json({
      success: true,
      data: {
        documents,
        totalCount,
        message: `Found ${totalCount} documents`
      }
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch documents'
    });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { id: documentId } = req.params;

    // Get document to find S3 key
    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    // Delete from S3
    try {
      await S3Service.deleteFile(document.s3Key);
    } catch (s3Error) {
      console.error('Error deleting from S3:', s3Error);
      // Continue with database deletion even if S3 deletion fails
    }

    // Delete from database
    await prisma.document.delete({
      where: { id: documentId }
    });

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete document'
    });
  }
};
