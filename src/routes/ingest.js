
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
/**
 * @swagger
 * /ingest:
 *   post:
 *     summary: Ingresa un archivo PDF para procesamiento RAG
 *     description: Sube un archivo PDF, extrae el texto, lo divide en chunks y los almacena en la base de datos vectorial
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo PDF a procesar
 *               docId:
 *                 type: string
 *                 description: ID opcional para el documento (usa el nombre del archivo si no se proporciona)
 *             required:
 *               - file
 *     responses:
 *       200:
 *         description: PDF procesado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *                 chunks:
 *                   type: integer
 *                   description: Número de chunks procesados
 *                 collection:
 *                   type: string
 *                   description: Nombre de la colección en Qdrant
 *       400:
 *         description: Error de solicitud (falta archivo o no se puede extraer texto)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Falta el archivo PDF"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
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
