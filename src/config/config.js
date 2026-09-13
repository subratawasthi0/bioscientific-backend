require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/chemical_db',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || 'your_access_key_here',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || 'your_secret_key_here',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || 'your_bucket_name',
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || 'http://127.0.0.1:9000',
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || 'your_minio_access_key',
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || 'your_minio_secret_key',
  MINIO_BUCKET: process.env.MINIO_BUCKET || 'your_minio_bucket',
  MINIO_USE_SSL: process.env.MINIO_USE_SSL || false
};