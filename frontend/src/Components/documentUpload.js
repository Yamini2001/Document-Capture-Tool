// DocumentUploader.jsx
import React, { useState } from 'react';
import axios from 'axios';

function DocumentUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentData, setDocumentData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setErrorMessage('');
    setDocumentData(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setDocumentData(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessage('Failed to upload and process the document.');
    }
  };

  return (
    <div>
      <h2>Select Document</h2>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button onClick={handleUpload}>Extract Details</button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {selectedFile && (
        <div>
          <h3>Preview:</h3>
          <img src={URL.createObjectURL(selectedFile)} alt="Document preview" width="300" />
        </div>
      )}

      {documentData && (
        <div>
          <h3>Extracted Details:</h3>
          <p>Name: {documentData.name}</p>
          <p>Document Number: {documentData.documentNumber}</p>
          <p>Expiration Date: {documentData.expirationDate}</p>
        </div>
      )}
    </div>
  );
}

export default DocumentUploader;
