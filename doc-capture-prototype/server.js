// server.js
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

const VISION_API_KEY = 'YOUR_GOOGLE_VISION_API_KEY'; // Replace with your actual API key

app.post('/upload', upload.single('file'), async (req, res) => {
  const imagePath = req.file.path;

  try {
    // Read the image file and convert it to Base64
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');

    // Send the image to the Google Vision API
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`,
      {
        requests: [
          {
            image: { content: imageBase64 },
            features: [{ type: 'TEXT_DETECTION' }]
          }
        ]
      }
    );

    const textAnnotations = response.data.responses[0].textAnnotations;
    const text = textAnnotations.map(d => d.description).join(" ");

    // Extract required details using regex or custom logic
    const name = extractName(text);
    const documentNumber = extractDocumentNumber(text);
    const expirationDate = extractExpirationDate(text);

    res.json({ name, documentNumber, expirationDate });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Failed to process image' });
  } finally {
    // Clean up the uploaded image
    fs.unlinkSync(imagePath);
  }
});

// Helper functions for extracting details
function extractName(text) {
  // Add regex or logic for extracting the name
  return "John Doe";
}

function extractDocumentNumber(text) {
  // Add regex or logic for extracting the document number
  return "ABCDE1234F";
}

function extractExpirationDate(text) {
  // Add regex or logic for extracting the expiration date
  return "01/01/2030";
}

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
