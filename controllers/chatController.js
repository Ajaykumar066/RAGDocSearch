const { queryRAG } = require('../services/ragService');

async function askQuestion(req, res) {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const answer = await queryRAG(question);
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { askQuestion };
