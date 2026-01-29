
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  qdrantUrl: process.env.QDRANT_URL || 'http://localhost:6333',
  qdrantApiKey: process.env.QDRANT_API_KEY || undefined,
  collection: process.env.QDRANT_COLLECTION || 'documentos',
  embeddingModel: process.env.EMBEDDING_MODEL || 'Xenova/bge-small-en-v1.5',
  groqApiKey: process.env.GROQ_API_KEY || undefined,
  groqModel: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
  chunkSize: parseInt(process.env.CHUNK_SIZE || '1000', 10),
  chunkOverlap: parseInt(process.env.CHUNK_OVERLAP || '200', 10),
};
