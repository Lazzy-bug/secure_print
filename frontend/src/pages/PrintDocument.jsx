// src/pages/PrintDocument.jsx
import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';  // Required styles
import { pdfjs } from 'pdfjs-dist';  // Correctly import pdfjs-dist

const PrintDocument = ({ documentUrl }) => {
  // Ensure that pdfjs is properly imported and version is accessible
  const workerUrl = pdfjs ? `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js` : '';

  return (
    <div>
      {/* Worker setup */}
      <Worker workerUrl={workerUrl}>
        <div style={{ height: '750px' }}>
          <Viewer fileUrl={documentUrl} />
        </div>
      </Worker>
    </div>
  );
};

export default PrintDocument;
