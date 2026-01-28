/**
 * Decode base64 string to image
 * @param {string} base64String - Base64 encoded image string
 * @returns {Promise<Buffer>} Image Buffer
 */
exports.decodeBase64Image = async (base64String) => {
  try {
    // Remove base64 prefix
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    // Decode to Buffer
    const buffer = Buffer.from(base64Data, 'base64');
    return buffer;
  } catch (error) {
    throw new Error('Failed to decode base64 image: ' + error.message);
  }
};

/**
 * Preprocess image to improve OCR recognition rate
 * @param {Buffer} imageBuffer - Image Buffer
 * @returns {Promise<Buffer>} Preprocessed image Buffer
 */
exports.preprocessImage = async (imageBuffer) => {
  try {
    // Return raw Buffer directly, temporarily skip Jimp processing
    // Image processing steps can be added later as needed
    // Note: In actual production environment, it's recommended to add the following preprocessing steps:
    // 1. Grayscale conversion
    // 2. Binarization
    // 3. Noise reduction
    // 4. Scaling
    // 5. Edge detection
    console.log('   Image preprocessing: using raw buffer (no Jimp processing)');
    return imageBuffer;
  } catch (error) {
    throw new Error('Failed to preprocess image: ' + error.message);
  }
};
