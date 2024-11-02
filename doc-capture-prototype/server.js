const express = require('express');
const Tesseract = require('tesseract.js');
const multer = require('multer');
const cors = require('cors');
const app = express();

app.use(cors());
const upload = multer({ dest: 'uploads/' }); // Temporary folder for uploaded images

app.post('/api/extract', upload.single('document'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Run OCR on the uploaded file
        const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng');
        
        // Define regex patterns for extracting fields
        const namePattern = /Name:\s*([A-Z\s]+)/i;
        const documentNumberPattern = /Document\s?Number:\s*([A-Z0-9]+)/i;
        const expirationDatePattern = /Expiration\s?Date:\s*([\d/.\-]+)/i;

        // Extract fields
        const name = text.match(namePattern)?.[1] || 'Not found';
        const documentNumber = text.match(documentNumberPattern)?.[1] || 'Not found';
        const expirationDate = text.match(expirationDatePattern)?.[1] || 'Not found';

        res.json({ name, documentNumber, expirationDate });
    } catch (error) {
        res.status(500).json({ error: 'Error processing document' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
