
        import express from 'express';
        import { embedTexts } from '../embeddings/bge.js';
        import { search } from '../vector/qdrant.js';
        import { answerWithOllama } from '../llm/ollama.js';

        const router = express.Router();

        /**
 * @swagger
 * /query:
 *   post:
 *     summary: Realiza una consulta RAG sobre los documentos ingeridos
 *     description: Busca documentos relevantes para una consulta y genera una respuesta usando LLM
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 description: Consulta a realizar sobre los documentos
 *                 example: "¿Cuáles son los temas principales del documento?"
 *               topK:
 *                 type: integer
 *                 description: Número de resultados a recuperar
 *                 default: 5
 *                 minimum: 1
 *                 maximum: 20
 *             required:
 *               - query
 *     responses:
 *       200:
 *         description: Consulta procesada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 *                   nullable: true
 *                   description: Respuesta generada por el LLM (null si no está disponible)
 *                   example: "Los temas principales del documento incluyen..."
 *                 hits:
 *                   type: array
 *                   description: Resultados relevantes encontrados
 *                   items:
 *                     type: object
 *                     properties:
 *                       rank:
 *                         type: integer
 *                         description: Posición del resultado
 *                       score:
 *                         type: number
 *                         description: Puntuación de similitud
 *                       docId:
 *                         type: string
 *                         description: ID del documento
 *                       chunk:
 *                         type: integer
 *                         description: Número del chunk
 *                       text:
 *                         type: string
 *                         description: Texto del chunk
 *       400:
 *         description: Error de solicitud (falta query)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Falta query"
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
router.post('/', async (req, res) => {
          const { query, topK = 5 } = req.body || {};
          if (!query) return res.status(400).json({ error: 'Falta query' });

          try {
            const [qVec] = await embedTexts([query]);
            const results = await search(qVec, topK);

            const context = results.map((r, i) => `[#${i+1} | score=${r.score.toFixed(3)}] ${r.payload.text}`).join('');

            // Si hay Ollama, generamos respuesta; si no, devolvemos solo el contexto
            let answer = null;
            try {
              answer = await answerWithOllama(query, context);
            } catch (e) {
              console.warn('Ollama no disponible o error en generación, devolviendo solo contexto');
            }

            res.json({
              answer,
              hits: results.map((r, i) => ({
                rank: i + 1,
                score: r.score,
                docId: r.payload.docId,
                chunk: r.payload.chunk,
                text: r.payload.text
              })),
            });
          } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
          }
        });

        export default router;
