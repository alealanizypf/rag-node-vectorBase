
import { QdrantClient } from '@qdrant/js-client-rest';
import { config } from '../config.js';

export const qdrant = new QdrantClient({
  url: config.qdrantUrl,
  apiKey: config.qdrantApiKey,
});

export async function ensureCollection(size) {
  const collection = config.collection;
  const exists = await qdrant.getCollection(collection).then(() => true).catch(() => false);
  if (!exists) {
    await qdrant.createCollection(collection, {
      vectors: { size, distance: 'Cosine' },
    });
  }
}

export async function upsertPoints(vectors, payloads) {
  const points = vectors.map((vec, i) => ({
    id: Date.now().toString() + '-' + i + '-' + Math.random().toString(36).slice(2),
    vector: Array.from(vec),
    payload: payloads[i],
  }));
  await qdrant.upsert(config.collection, { points });
  return points.length;
}

export async function search(queryVector, topK = 5, filters) {
  const res = await qdrant.search(config.collection, {
    vector: Array.from(queryVector),
    limit: topK,
    filter: filters,
    with_payload: true,
    score_threshold: undefined,
  });
  return res;
}
