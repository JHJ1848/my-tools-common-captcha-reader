# Captcha Reader Service

A backend service for captcha recognition via HTTP requests, capable of recognizing numbers and arithmetic operators (four fundamental operations) from base64 encoded images and returning the calculated result as an integer.

## Features

- **HTTP API**: RESTful API endpoint for captcha recognition
- **Base64 Support**: Accepts base64 encoded images as input
- **OCR Recognition**: Uses Tesseract.js for text recognition
- **Arithmetic Calculation**: Automatically calculates the result of recognized expressions
- **Test Mode**: Built-in test mode for debugging
- **Detailed Logging**: Comprehensive logging for debugging and monitoring
- **Error Handling**: Proper error handling with appropriate status codes

## Environment Requirements

- **Node.js**: Version 14.0.0 or higher
- **npm**: Version 6.0.0 or higher
- **Operating System**: Windows, macOS, Linux, or WSL (Windows Subsystem for Linux)

## Dependencies

| Dependency | Version | Description |
|------------|---------|-------------|
| express | ^4.17.1 | Web framework for Node.js |
| tesseract.js | ^2.1.4 | OCR library for text recognition |
| jimp | ^0.16.1 | Image processing library (optional) |

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd captcha-reader
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Usage

### Starting the Service

```bash
npm start
```

The service will start on port 3000 by default. You can change the port by setting the `PORT` environment variable.

### API Endpoint

#### POST /api/captcha/recognize

**Request Body**:
```json
{
  "image": "base64 encoded image string"
}
```

**Response**:
```json
{
  "result": 6,
  "details": {
    "rawOcrResult": "0 x 8 + 6 = ?",
    "cleanedText": "0x8+6",
    "expression": "0*8+6",
    "calculation": "0*8+6 = 0+6 = 6"
  }
}
```

### Test Mode

To test the service without actual image processing, use the test mode by sending `"test-captcha"` as the image parameter:

```json
{
  "image": "test-captcha"
}
```

This will return the expected result `6` for the expression "0x8+6".

## Health Check

You can check the health status of the service by visiting:

```
http://localhost:3000/health
```

## Project Structure

```
captcha-reader/
├── src/
│   ├── app.js                 # Main application entry point
│   ├── routes/
│   │   └── captcha.js         # API endpoint for captcha recognition
│   ├── services/
│   │   └── captchaService.js  # Core captcha recognition logic
│   └── utils/
│       └── imageUtils.js      # Image processing utilities
├── test-captcha-api.js        # Test script for API endpoint
├── test-captcha-data.json     # Test data for API testing
├── ecosystem.config.js        # PM2 configuration file
├── package.json               # Project configuration and dependencies
└── README.md                  # This documentation
```

## Deployment

### Using PM2 (Recommended)

1. **Install PM2**:
   ```bash
   npm install -g pm2
   ```

2. **Start the service with PM2**:
   ```bash
   pm2 start ecosystem.config.js
   ```

3. **Set up auto-start on boot**:
   ```bash
   pm2 startup
   pm2 save
   ```

### On WSL

The service can be deployed on WSL (Windows Subsystem for Linux) following the same installation and deployment steps.

## Troubleshooting

### Common Issues

1. **Base64 decoding error**: Ensure the base64 string is properly formatted and includes the correct prefix (e.g., `data:image/png;base64,`).

2. **OCR recognition error**: The service may have difficulty recognizing distorted or heavily stylized captchas. Consider adding image preprocessing steps in `imageUtils.js`.

3. **Expression extraction error**: If the service fails to extract a valid arithmetic expression, check the OCR output in the logs for debugging.

### Logs

The service generates detailed logs for each request, including:
- Base64 decoding status
- Image preprocessing steps
- OCR recognition results
- Expression extraction and calculation

## License

ISC
