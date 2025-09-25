const { S3Client, GetBucketLocationCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

async function checkBucketRegion() {
  try {
    console.log('Checking bucket region...');
    
    const s3Client = new S3Client({
      region: 'us-east-1', // Use us-east-1 for GetBucketLocation
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    
    const command = new GetBucketLocationCommand({
      Bucket: 'knowledgetestinglogic'
    });
    
    const response = await s3Client.send(command);
    console.log('Bucket region:', response.LocationConstraint || 'us-east-1');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkBucketRegion();
