const http = require('http');
const fs = require('fs');
const path = require('path');

/**
 * Test single captcha recognition
 * @param {Object} testCase Test case
 * @param {number} index Test case index
 * @param {number} total Total test cases
 * @param {Function} callback Callback function
 */
function testSingleCaptcha(testCase, index, total, callback) {
  console.log(`\n=== Test Case ${index}/${total} ===`);
  console.log(`ID: ${testCase.id}`);
  console.log(`Name: ${testCase.name}`);
  console.log(`Description: ${testCase.description}`);
  console.log(`Expected Result: ${testCase.expected_result}`);
  
  const testData = JSON.stringify({ image: testCase.image });
  
  const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/captcha/recognize',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': testData.length
    }
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`状态码: ${res.statusCode}`);
      console.log(`响应体: ${data}`);
      
      // Analyze response
      try {
        const response = JSON.parse(data);
        if (response.error) {
          console.log('❌ API returned error:');
          console.log(response.error);
          callback({ success: false, error: response.error });
        } else if (response.result !== undefined) {
          console.log('✅ API returned result:');
          console.log(`result: ${response.result}`);
          
          // Show details (if available)
          if (response.details) {
            console.log('📋 Details:');
            if (response.details.rawOcrResult) {
              console.log(`   Raw OCR Result: ${JSON.stringify(response.details.rawOcrResult)}`);
            }
            if (response.details.cleanedText) {
              console.log(`   Cleaned Text: ${JSON.stringify(response.details.cleanedText)}`);
            }
            if (response.details.expression) {
              console.log(`   Extracted Expression: ${JSON.stringify(response.details.expression)}`);
            }
            if (response.details.calculation) {
              console.log(`   Calculation Process: ${response.details.calculation}`);
            }
          }
          
          const isCorrect = response.result === testCase.expected_result;
          console.log(`Result ${isCorrect ? 'Correct' : 'Incorrect'}: ${response.result} ${isCorrect ? '=' : '≠'} ${testCase.expected_result}`);
          callback({ success: true, correct: isCorrect, result: response.result, expected: testCase.expected_result, details: response.details });
        } else {
          console.log('❌ API returned incorrect format, missing result field');
          callback({ success: false, error: 'Incorrect return format' });
        }
      } catch (error) {
        console.log('❌ Failed to parse response JSON:', error.message);
        callback({ success: false, error: 'Failed to parse response' });
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
    callback({ success: false, error: error.message });
  });
  
  req.write(testData);
  req.end();
}

/**
 * Test captcha recognition API
 * Read test cases from test-captcha-data.json file
 * Send requests to http://127.0.0.1:3000/api/captcha/recognize
 * Verify if returned results are correct
 */
function testCaptchaApi() {
  console.log('=== Starting Captcha Recognition API Test ===');
  console.log('Service URL: http://127.0.0.1:3000/api/captcha/recognize');
  
  // Read test data
  const testDataPath = path.join(__dirname, 'test-captcha-data.json');
  
  if (!fs.existsSync(testDataPath)) {
    console.error('❌ Test data file not found:', testDataPath);
    return;
  }
  
  try {
    const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf8'));
    const testCases = testData.test_cases || [];
    
    if (testCases.length === 0) {
      console.error('❌ No test cases found in test data file');
      return;
    }
    
    console.log(`\nFound ${testCases.length} test cases`);
    
    let completed = 0;
    let passed = 0;
    const results = [];
    
    // 逐个测试
    testCases.forEach((testCase, index) => {
      testSingleCaptcha(testCase, index + 1, testCases.length, (result) => {
        results.push(result);
        completed++;
        
        if (result.success && result.correct) {
          passed++;
        }
        
        // All tests completed
        if (completed === testCases.length) {
          console.log('\n=== Test Completed ===');
          console.log(`Total Test Cases: ${testCases.length}`);
          console.log(`Passed: ${passed}`);
          console.log(`Failed: ${testCases.length - passed}`);
          console.log(`Success Rate: ${((passed / testCases.length) * 100).toFixed(2)}%`);
          
          // Output detailed results
          console.log('\n=== Detailed Results ===');
          results.forEach((res, i) => {
            const testCase = testCases[i];
            if (res.success && res.correct) {
              console.log(`✅ Test Case ${i + 1}: ${testCase.description} - Correct (${res.result})`);
            } else if (res.success && !res.correct) {
              console.log(`❌ Test Case ${i + 1}: ${testCase.description} - Incorrect (Expected: ${res.expected}, Actual: ${res.result})`);
            } else {
              console.log(`❌ Test Case ${i + 1}: ${testCase.description} - Failed (${res.error})`);
            }
          });
        }
      });
    });
    
  } catch (error) {
    console.error('❌ Failed to read test data:', error.message);
  }
}

/**
 * Create a simple test image file
 * For testing API functionality
 */
function createTestImage() {
  console.log('Creating test image file...');
  // Here we create a simple text file as a test
  // In actual use, this should be replaced with a real captcha image
  const testContent = 'Test captcha image content';
  fs.writeFileSync(path.join(__dirname, 'test-captcha.txt'), testContent);
  console.log('Test file created: test-captcha.txt');
  console.log('Note: This is not a real image file, please replace with a real captcha image');
}

// Run tests
if (require.main === module) {
  console.log('Starting Captcha API Test...');
  console.log('Service URL: http://127.0.0.1:3000/api/captcha/recognize');
  console.log('');
  
  testCaptchaApi();
}

module.exports = {
  testCaptchaApi
};