const express = require('express');
const router = express.Router();
const { askQuestion } = require('../controllers/chatController');

router.post('/chat', askQuestion);

module.exports = router;
