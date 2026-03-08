const express = require('express');
const router = express.Router();
const { upload, uploadPDF } = require('../controllers/uploadController');

router.post('/upload', upload.single('file'), uploadPDF);

module.exports = router;
