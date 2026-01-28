
        import express from 'express';
        import { embedTexts } from '../embeddings/bge.js';
        import { search } from '../vector/qdrant.js';
        import { answerWithOllama } from '../llm/ollama.js';

        const router = express.Router();

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
