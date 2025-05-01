import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({ userId, shopId }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("shopId", shopId);

    try {
      const response = await axios.post("http://localhost:5000/api/chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("File uploaded successfully!");
      setError("");
    } catch (error) {
      setError("Failed to upload file.");
      setSuccessMessage("");
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
