import { config } from '../config.js';
import Groq from 'groq-sdk';

const client = new Groq({ apiKey: config.groqApiKey });

export async function answerWithGroq(question, context) {
  const system = 'Eres un asistente experto en análisis de texto. Tu objetivo es responder a las preguntas de forma completa y detallada, utilizando únicamente el contexto proporcionado. Siempre debes citar textualmente los fragmentos del contexto que uses para formular tu respuesta. Si la información no está explícitamente en el contexto, indica que no puedes responder con la información disponible. Enfócate en extraer y presentar la información relevante de manera clara y concisa, pero sin omitir detalles importantes que estén en el contexto.';
  const user = `Usa exclusivamente el siguiente contexto para responder. Si la respuesta no está en el contexto, di que no está disponible.

Analiza cuidadosamente el contexto y proporciona una respuesta completa y detallada. Incluye:
1. La información principal que responde directamente a la pregunta
2. Detalles relevantes del contexto que enriquezcan la respuesta
3. Cita textualmente los fragmentos más importantes del contexto

CONTEXTO:
${context}

PREGUNTA:
${question}

Responde de manera elaborada y completa, basándote únicamente en la información proporcionada en el contexto.`;

  const res = await client.chat.completions.create({
    model: config.groqModel,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    temperature: 0.5,
    max_tokens: 1000,
  });
  return res?.choices?.[0]?.message?.content || '';
}
