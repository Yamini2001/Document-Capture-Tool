import React, { useState } from 'react';
import axios from 'axios';

const DocumentUpload = () => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('document', file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setData(response.data);
        } catch (error) {
            console.error('Error uploading document:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} required />
                <button type="submit">Upload Document</button>
            </form>
            {data && (
                <div>
                    <h3>Extracted Data:</h3>
                    <p><strong>Name:</strong> {data.name || 'Not found'}</p>
                    <p><strong>Document Number:</strong> {data.documentNumber || 'Not found'}</p>
                    <p><strong>Expiration Date:</strong> {data.expirationDate || 'Not found'}</p>
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;
