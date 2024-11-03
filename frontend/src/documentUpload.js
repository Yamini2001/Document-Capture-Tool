// DocumentUploader.jsx
import React, { useState } from 'react';
import axios from 'axios';

function DocumentUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentData, setDocumentData] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData);
      setDocumentData(response.data); // Display extracted details
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <h2>Upload Document</h2>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button onClick={handleUpload}>Extract Details</button>

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
