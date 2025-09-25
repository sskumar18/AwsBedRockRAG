// backend/src/services/s3Service.ts
import {
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, s3Config } from "../config/aws";

export class S3Service {
  static async uploadFile(
    key: string,
    file: Buffer,
    contentType: string
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await s3Client.send(command);
    return `https://${s3Config.bucketName}.s3.${s3Config.region}.amazonaws.com/${key}`;
  }

  static async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key,
    });

    await s3Client.send(command);
  }

  static async getPresignedUploadUrl(
    key: string,
    contentType: string
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key,
      ContentType: contentType,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
  }

  // Simpler key generation
  static generateFileKey(knowledgeBaseId: string, filename: string): string {
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    return `documents/${knowledgeBaseId}_${timestamp}_${sanitizedFilename}`;
  }
}
