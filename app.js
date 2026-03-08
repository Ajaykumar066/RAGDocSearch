const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const uploadRouter = require('./routers/upload');
const chatRouter = require('./routers/chat');

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', uploadRouter);
app.use('/api', chatRouter);

module.exports = app;