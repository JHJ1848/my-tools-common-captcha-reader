const express = require('express');
const router = express.Router();
const captchaService = require('../services/captchaService');

/**
 * Captcha recognition route
 * POST /api/captcha/recognize
 * Request body: { "image": "base64 encoded image string" }
 * Response: { "result": calculation result integer }
 */
router.post('/recognize', async (req, res) => {
  try {
    // Validate request body
    if (!req.body || !req.body.image) {
      return res.status(400).json({ error: 'Missing image parameter' });
    }
    
    const { image } = req.body;
    
    // Call captcha recognition service
    const recognitionResult = await captchaService.recognizeCaptcha(image);
    
    // Return result with details
    res.json(recognitionResult);
  } catch (error) {
    console.error('Error recognizing captcha:', error);
    
    // Return different status codes based on error type
    if (error.message.includes('Failed to decode base64 image')) {
      res.status(400).json({ error: 'Invalid base64 image format' });
    } else if (error.message.includes('Failed to extract expression')) {
      res.status(400).json({ error: 'Failed to extract expression from image' });
    } else {
      res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
  }
});

module.exports = router;
