
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  qdrantUrl: process.env.QDRANT_URL || 'http://localhost:6333',
  qdrantApiKey: process.env.QDRANT_API_KEY || undefined,
  collection: process.env.QDRANT_COLLECTION || 'documentos',
  embeddingModel: process.env.EMBEDDING_MODEL || 'Xenova/bge-small-en-v1.5',
  ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'llama3',
  chunkSize: parseInt(process.env.CHUNK_SIZE || '1000', 10),
  chunkOverlap: parseInt(process.env.CHUNK_OVERLAP || '200', 10),
};
