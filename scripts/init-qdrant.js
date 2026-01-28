
import { embeddingSize } from '../src/embeddings/bge.js';
import { ensureCollection } from '../src/vector/qdrant.js';
import { config } from '../src/config.js';

(async () => {
  const size = await embeddingSize();
  await ensureCollection(size);
  console.log(`Colección '${config.collection}' lista con dimensión ${size}`);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
