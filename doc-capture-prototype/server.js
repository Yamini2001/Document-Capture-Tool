// server.js
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());

const VISION_API_KEY = process.env.VISION_API_KEY;

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // Default user for XAMPP
  password: '',      // Default password is empty
  database: 'uploads'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connect to MySQL Database');
});

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
    if (!textAnnotations || textAnnotations.length === 0) {
      throw new Error('No text detected in the image');
    }
    const text = textAnnotations.map(d => d.description).join(" ");

    // Extract required details using regex
    const name = extractName(text);
    const documentNumber = extractDocumentNumber(text);
    const expirationDate = extractExpirationDate(text);

    // Insert data into MySQL
    const sql = 'INSERT INTO documents (name, documentNumber, expirationDate) VALUES (?, ?, ?)';
    db.query(sql, [name, documentNumber, expirationDate], (err, result) => {
      if (err) {
        console.error('Failed to insert data into MySQL:', err);
        return res.status(500).json({ error: 'Database insertion failed' });
      }
      console.log('Data inserted into MySQL:', result);
      res.json({ name, documentNumber, expirationDate });
    });
  } catch (error) {
    console.error('Error processing image:', error.message || error);
    res.status(500).json({ error: 'Failed to process image' });
  } finally {
    fs.unlinkSync(imagePath); // Clean up the uploaded image
  }
});

// Helper functions for extracting details
function extractName(text) {
  const nameRegex = /(?:Name|Holder):?\s*([A-Za-z\s]+)/i;
  const match = text.match(nameRegex);
  return match ? match[1].trim() : "Name not found";
}

function extractDocumentNumber(text) {
  const numberRegex = /(?:Document|PAN|ID|Number):?\s*([A-Z0-9]+)/i;
  const match = text.match(numberRegex);
  return match ? match[1].trim() : "Document number not found";
}

function extractExpirationDate(text) {
  const dateRegex = /\b(\d{2}\/\d{2}\/\d{4})\b/;
  const match = text.match(dateRegex);
  return match ? match[1] : "Expiration date not found";
}

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
