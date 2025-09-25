import { Request, Response } from 'express';
import { BedrockAgentRuntimeClient, RetrieveCommand, RetrieveAndGenerateCommand } from '@aws-sdk/client-bedrock-agent-runtime';
import { bedrockKBConfig, bedrockConfig } from '../config/aws';

// Create Bedrock Agent Runtime Client
const bedrockAgentRuntimeClient = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const chatWithKnowledgeBase = async (req: Request, res: Response) => {
  try {
    const { id: knowledgeBaseId } = req.params;
    const { message, maxResults = 5 } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    console.log(`Chatting with Knowledge Base: ${bedrockKBConfig.knowledgeBaseId}`);
    console.log(`User message: ${message}`);

    // Use Bedrock Retrieve and Generate for RAG
    const command = new RetrieveAndGenerateCommand({
      input: {
        text: message
      },
      retrieveAndGenerateConfiguration: {
        type: 'KNOWLEDGE_BASE',
        knowledgeBaseConfiguration: {
          knowledgeBaseId: bedrockKBConfig.knowledgeBaseId,
          modelArn: bedrockConfig.modelArn,
          retrievalConfiguration: {
            vectorSearchConfiguration: {
              numberOfResults: maxResults
            }
          }
        }
      }
    });

    const response = await bedrockAgentRuntimeClient.send(command);
    
    console.log('Bedrock response received');

    res.json({
      success: true,
      data: {
        message: response.output?.text || 'No response generated',
        sources: response.citations?.map(citation => ({
          retrievedReferences: citation.retrievedReferences?.map(ref => ({
            content: ref.content?.text,
            location: ref.location?.s3Location,
            score: ref.score
          }))
        })) || [],
        sessionId: response.sessionId,
        knowledgeBaseId: bedrockKBConfig.knowledgeBaseId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat request',
      details: error.message
    });
  }
};

// Alternative: Just retrieve documents without generation
export const retrieveDocuments = async (req: Request, res: Response) => {
  try {
    const { id: knowledgeBaseId } = req.params;
    const { query, maxResults = 5 } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    console.log(`Retrieving documents for query: ${query}`);

    const command = new RetrieveCommand({
      knowledgeBaseId: bedrockKBConfig.knowledgeBaseId,
      retrievalQuery: {
        text: query
      },
      retrievalConfiguration: {
        vectorSearchConfiguration: {
          numberOfResults: maxResults
        }
      }
    });

    const response = await bedrockAgentRuntimeClient.send(command);
    
    console.log(`Retrieved ${response.retrievalResults?.length || 0} documents`);

    res.json({
      success: true,
      data: {
        query,
        results: response.retrievalResults?.map(result => ({
          content: result.content?.text,
          location: result.location?.s3Location,
          score: result.score,
          metadata: result.metadata
        })) || [],
        knowledgeBaseId: bedrockKBConfig.knowledgeBaseId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error retrieving documents:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve documents',
      details: error.message
    });
  }
};
