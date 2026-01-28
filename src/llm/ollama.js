
        import { config } from '../config.js';
        import { Ollama } from 'ollama';

        const client = new Ollama({ host: config.ollamaHost });

        export async function answerWithOllama(question, context) {
          const system = 'Eres un asistente experto. Responde en español de forma concisa y cita fragmentos relevantes del contexto cuando sea posible.';
          const user = `Usa exclusivamente el siguiente contexto para responder. Si la respuesta no está en el contexto, di que no está disponible.

CONTEXTO:
${context}

PREGUNTA:
${question}`;

          const res = await client.chat({
            model: config.ollamaModel,
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user }
            ],
          });
          return res?.message?.content || '';
        }
