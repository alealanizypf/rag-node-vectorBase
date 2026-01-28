
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractTextFromPDF } from '../loaders/pdf.js';
import { splitText } from '../embeddings/text-splitter.js';
import { embedTexts, embeddingSize } from '../embeddings/bge.js';
import { ensureCollection, upsertPoints } from '../vector/qdrant.js';
import { config } from '../config.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const EMBEDDING_SIZE = await embeddingSize();
router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Falta el archivo PDF' });
  const docId = req.body.docId || req.file.originalname;
  const filePath = req.file.path;

  try {
    const text = await extractTextFromPDF(filePath);
    if (!text.trim()) throw new Error('No se pudo extraer texto del PDF');

    const chunks = await splitText(text);
    const vectors = await embedTexts(chunks);

    await ensureCollection(EMBEDDING_SIZE);

    const payloads = chunks.map((c, i) => ({
      docId,
      chunk: i,
      text: c,
      filename: req.file.originalname,
    }));

    const inserted = await upsertPoints(vectors, payloads);
    res.json({ ok: true, chunks: inserted, collection: config.collection });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    fs.unlink(filePath, () => {});
  }
});

export default router;
