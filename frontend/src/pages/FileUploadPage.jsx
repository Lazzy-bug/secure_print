import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaArrowCircleLeft,
  FaShieldAlt,
  FaFileUpload,
  FaStore,
  FaLock,
  FaTrashAlt,
} from 'react-icons/fa';

const FileUploadPage = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [ownerId, setOwnerId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFileDetails, setUploadedFileDetails] = useState(null);
  const [shopName, setShopName] = useState('');

  useEffect(() => {
    const fetchShopInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/shops/${shopId}`
        );
        const shop = response.data.shop;
        if (shop && shop.owner) {
          setOwnerId(shop.owner._id);
          setShopName(
            shop.name.charAt(0).toUpperCase() + shop.name.slice(1)
          );
        } else {
          setError('Shop information is missing.');
        }
      } catch (error) {
        setError('Failed to fetch shop information.');
      }
    };

    fetchShopInfo();
  }, [shopId]);

  const getUserIdFromToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to upload a file.');
      return null;
    }

    try {
      const jwt_decode = (await import('jwt-decode')).default;
      const decodedToken = jwt_decode(token);
      return decodedToken.id;
    } catch (error) {
      setError('Failed to decode the token.');
      return null;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
    }
  };

  const handleFileUpload = async () => {
    if (isUploading) return;

    setIsUploading(true);
    setError('');
    setSuccessMessage('');
    setProgress(0);

    if (!selectedFile) {
      setError('Please select a file to upload.');
      setIsUploading(false);
      return;
    }

    const userId = await getUserIdFromToken();
    if (!userId) {
      setIsUploading(false);
      return;
    }

    if (!ownerId) {
      setError('Owner ID is not available.');
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userId', userId);
    formData.append('shopId', shopId);
    formData.append('ownerId', ownerId);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/chat/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage('File uploaded successfully!');
        setUploadedFileDetails({
          name: selectedFile.name,
          size: selectedFile.size,
        });
        setSelectedFile(null);
      } else {
        setError('Failed to upload file. Please try again.');
      }
    } catch (error) {
      setError('Failed to upload file. Please try again.');
    }

    setIsUploading(false);
  };

  return (
    <div className="wrapper">
      <button onClick={() => navigate(-1)} className="back-button">
        <FaArrowCircleLeft />
      </button>

      <div className="header">
        <h1 className="title">Upload Secure Document</h1>
        <p className="shop-info">
          <FaStore /> Shop: <span className="shop-name">{shopName}</span>
        </p>
        <p className="shop-id">
          Shop ID: <span>{shopId}</span>
        </p>
        <p className="description">
          Your document is safe with us. <FaShieldAlt /> All files are encrypted
          and deleted after printing.
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="file-upload-section">
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          className="file-upload-input"
        />
        <label htmlFor="file-upload" className="file-upload-label">
          <FaFileUpload /> Select a file
        </label>
      </div>

      {selectedFile && (
        <div className="file-preview">
          <p>
            <strong>Selected File:</strong> {selectedFile.name}
          </p>
        </div>
      )}

      <button
        onClick={handleFileUpload}
        disabled={isUploading}
        className="upload-button"
      >
        {isUploading ? 'Uploading...' : 'Upload File'}
      </button>

      {isUploading && (
        <div className="progress-area">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          ></div>
          <p>{progress}%</p>
        </div>
      )}

      {uploadedFileDetails && (
        <div className="uploaded-area">
          <p>
            <FaLock /> Your file "{uploadedFileDetails.name}" has been encrypted
            and securely uploaded.
          </p>
          <p>Size: {(uploadedFileDetails.size / 1024).toFixed(2)} KB</p>
          <p>
            <FaTrashAlt /> Files are deleted after printing to ensure your
            privacy.
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUploadPage;
