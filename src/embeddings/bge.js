
import { pipeline } from '@xenova/transformers';
import { config } from '../config.js';

// Singleton para el pipeline de embeddings
let extractorPromise = null;
async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline('feature-extraction', config.embeddingModel);
  }
  return extractorPromise;
}

export async function embedTexts(texts) {
  const extractor = await getExtractor();
  const outputs = [];
  for (const t of texts) {
    // pooling y normalización soportados por transformers.js
    const out = await extractor(t, { pooling: 'mean', normalize: true });
    outputs.push(out.data);
  }
  return outputs; // Array<Float32Array>
}

export async function embeddingSize() {
  const extractor = await getExtractor();
  const out = await extractor('texto de prueba', { pooling: 'mean', normalize: true });
  return out.data.length;
}
