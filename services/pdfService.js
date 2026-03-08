const fs = require('fs').promises;
const pdfParse = require('pdf-parse');

async function extractTextFromPDF(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

module.exports = { extractTextFromPDF };
