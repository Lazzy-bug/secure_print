import React, { useState } from "react";
import axios from "axios";
import routes from "../../routes";

const FileUploadModal = ({ shopId }) => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("shopId", shopId);

    try {
      setStatus("Uploading...");
      const response = await axios.post(routes.uploadFile, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setStatus("Upload failed.");
    }
  };

  return (
    <div className="p-4">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button className="bg-blue-500 text-white p-2 mt-2" onClick={handleUpload}>
        Upload
      </button>
      <p>{status}</p>
    </div>
  );
};

export default FileUploadModal;
