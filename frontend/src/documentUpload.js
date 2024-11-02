import React, { useState } from 'react';
import axios from 'axios';

function DocumentCapture() {
    const [file, setFile] = useState(null);
    const [extractedData, setExtractedData] = useState(null);
    const [error, setError] = useState(null);

    // Handle file change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('document', file);

        try {
            const response = await axios.post('http://localhost:5000/api/extract', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setExtractedData(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to process document');
            setExtractedData(null);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Document Capture</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button type="submit">Extract Information</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {extractedData && (
                <div>
                    <h3>Extracted Information:</h3>
                    <p><strong>Name:</strong> {extractedData.name}</p>
                    <p><strong>Document Number:</strong> {extractedData.documentNumber}</p>
                    <p><strong>Expiration Date:</strong> {extractedData.expirationDate}</p>
                </div>
            )}
        </div>
    );
}

export default DocumentCapture;
