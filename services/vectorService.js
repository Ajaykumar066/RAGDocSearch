const pgvector = require('pgvector/pg');
const { query, pool } = require('../config/db');

pool.on('connect', async (client) => {
  await pgvector.registerTypes(client);
});

async function storeEmbedding(content, embedding) {
  await query(
    'INSERT INTO document_chunks (content, embedding) VALUES ($1, $2)',
    [content, pgvector.toSql(embedding)]
  );
}

async function similaritySearch(queryEmbedding, limit = 5) {
  const result = await query(
    'SELECT id, content FROM document_chunks ORDER BY embedding <=> $1 LIMIT $2',
    [pgvector.toSql(queryEmbedding), limit]
  );
  return result.rows;
}

module.exports = { storeEmbedding, similaritySearch };
