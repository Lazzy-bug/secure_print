import { useEffect, useState } from "react";
 // Import the external CSS

export const DocumentPreview = ({ documentId, token }) => {
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/chat/decrypt-file/${encodeURIComponent(documentId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          setError("Failed to load preview");
          setLoading(false);
          return;
        }

        const contentType = response.headers.get("content-type");
        setFileType(contentType);

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (documentId && token) {
      fetchPreview();
    }

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [documentId, token]);

  const isPDF = fileType?.includes("pdf");

  return (
    <div className="document-preview-container">
      {loading ? (
        <div className="loading">Loading preview...</div>
      ) : error ? (
        <div className="error">Error loading preview</div>
      ) : isPDF ? (
        <object
          data={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          type="application/pdf"
          className="pdf-preview"
        >
          <div className="preview-center">PDF Document</div>
        </object>
      ) : (
        <div className="preview-center">
          <img
            src={previewUrl}
            alt="Document Preview"
            className="image-preview"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      )}
    </div>
  );
};
