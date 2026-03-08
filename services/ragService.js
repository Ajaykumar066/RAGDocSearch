const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const { generateEmbedding } = require('./embeddingService');
const { similaritySearch } = require('./vectorService');

async function queryRAG(question) {
  const queryEmbedding = await generateEmbedding(question);
  const chunks = await similaritySearch(queryEmbedding, 5);
  const context = chunks.map((chunk) => chunk.content).join('\n\n');
  const prompt = `Use the following context to answer the question.

Context:
${context}

Question:
${question}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
  });

  return response.choices[0].message.content;
}

module.exports = { queryRAG };
