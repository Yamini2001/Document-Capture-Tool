const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const path = require('path');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// Endpoint for document upload and extraction
app.post('/upload', upload.single('document'), async (req, res) => {
    try {
        const filePath = path.join(__dirname, req.file.path);

        // Extract text using Tesseract
        const { data: { text } } = await Tesseract.recognize(filePath, 'eng');

        // Regex patterns for extracting name, document number, and expiration date
        const nameMatch = text.match(/Name:\s*([A-Z\s]+)/);
        const documentNumberMatch = text.match(/Document Number:\s*(\w+)/);
        const expirationDateMatch = text.match(/Expiration Date:\s*([\d-]+)/);

        const extractedData = {
            name: nameMatch ? nameMatch[1] : null,
            documentNumber: documentNumberMatch ? documentNumberMatch[1] : null,
            expirationDate: expirationDateMatch ? expirationDateMatch[1] : null,
        };

        res.json(extractedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process the document' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
