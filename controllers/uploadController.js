const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

const { extractTextFromPDF } = require('../services/pdfService');
const { chunkText } = require('../utils/chunkText');
const { generateEmbedding } = require('../services/embeddingService');
const { storeEmbedding } = require('../services/vectorService');

const uploadsDir = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    require('fs').mkdirSync(uploadsDir, { recursive: true });
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
});

async function uploadPDF(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const text = await extractTextFromPDF(req.file.path);
    const chunks = chunkText(text).filter((c) => c.trim());

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk);
      await storeEmbedding(chunk, embedding);
    }

    await fs.unlink(req.file.path).catch(() => {});

    res.json({ success: true, chunksStored: chunks.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { upload, uploadPDF };
