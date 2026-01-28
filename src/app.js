const express = require('express');
const bodyParser = require('body-parser');
const captchaRoutes = require('./routes/captcha');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure middleware
app.use(bodyParser.json({ limit: '5mb' })); // Increase request body size limit to support larger base64 images
app.use(bodyParser.urlencoded({ extended: true }));

// Register routes
app.use('/api/captcha', captchaRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Captcha reader service is running' });
});

// 404 handling
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Captcha reader service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoint: POST http://localhost:${PORT}/api/captcha/recognize`);
});
