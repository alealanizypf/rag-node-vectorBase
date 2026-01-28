
import { config } from '../config.js';

export function splitText(text) {
  const size = config.chunkSize;
  const overlap = config.chunkOverlap;
  const chunks = [];

  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + size, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk) chunks.push(chunk);
    start = end - overlap;
    if (start < 0) start = 0;
    if (start >= text.length) break;
  }
  return chunks;
}
