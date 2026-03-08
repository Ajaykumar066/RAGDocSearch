const CHUNK_SIZE = 500;
const OVERLAP = 100;
const STEP = CHUNK_SIZE - OVERLAP;

function chunkText(text, chunkSize = CHUNK_SIZE, overlap = OVERLAP) {
  if (!text || text.length === 0) return [];

  const chunks = [];
  const step = chunkSize - overlap;
  let start = 0;

  while (start < text.length) {
    const chunk = text.slice(start, start + chunkSize);
    chunks.push(chunk);
    start += step;
  }

  return chunks;
}

module.exports = { chunkText };
