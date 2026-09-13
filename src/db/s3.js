const { S3Client } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  endpoint: process.env.MINIO_ENDPOINT, // "http://127.0.0.1:9000"
  region: 'us-east-1', // MinIO requires a region, any value works
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
  },
  forcePathStyle: true, // CRUCIAL for MinIO
});

module.exports = { s3Client };