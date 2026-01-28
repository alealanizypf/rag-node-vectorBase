
import { config } from '../config.js';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

export async function splitText(text) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: config.chunkSize,
    chunkOverlap: config.chunkOverlap,
  });
  return await splitter.splitText(text);
}
