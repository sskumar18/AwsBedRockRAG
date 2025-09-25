// backend/src/config/aws.ts
import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { BedrockAgentClient } from "@aws-sdk/client-bedrock-agent";
import { OpenSearchClient } from "@aws-sdk/client-opensearch";
import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

// AWS Configuration
export const awsConfig = {
  region: process.env.AWS_REGION || "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
};

// Bedrock Runtime Client (for text generation)
export const bedrockClient = new BedrockRuntimeClient(awsConfig);

// Bedrock Agent Client (for knowledge base operations)
export const bedrockAgentClient = new BedrockAgentClient(awsConfig);

// S3 Client - logicaihub bucket is in eu-north-1
export const s3Client = new S3Client({
  region: "eu-north-1", // logicaihub bucket is in eu-north-1
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// OpenSearch Client
export const openSearchClient = new OpenSearchClient(awsConfig);

// Your Existing Bedrock Knowledge Base Configuration
export const bedrockKBConfig = {
  knowledgeBaseId: "XX2AKVKPIM", // Your actual KB ID
  dataSourceId: "L469ZGRRT3", // Your actual Data Source ID
};

// Your Specific Model Configuration
export const bedrockConfig = {
  modelId: "eu.anthropic.claude-3-7-sonnet-20250219-v1:0",
  modelArn: "arn:aws:bedrock:eu-north-1:414596574191:inference-profile/eu.anthropic.claude-3-7-sonnet-20250219-v1:0",
  region: "eu-north-1",
  providerName: "Anthropic",
  modelName: "Claude 3.7 Sonnet",
  embeddingModelId: "amazon.titan-embed-text-v1",
};

// S3 Configuration - Updated to use logicaihub bucket
export const s3Config = {
  bucketName: "logicaihub", // Updated to use logicaihub bucket
  region: "eu-north-1", // logicaihub bucket is in eu-north-1
};

// OpenSearch Configuration
export const openSearchConfig = {
  endpoint: process.env.OPENSEARCH_ENDPOINT || "",
  indexName: process.env.OPENSEARCH_INDEX_NAME || "bedrock-rag-chunks",
};
