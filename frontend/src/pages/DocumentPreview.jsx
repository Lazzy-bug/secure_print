import { useEffect, useState } from "react";


export const DocumentPreview = ({ documentId, token }) => {
  const [previewUrl, setPreviewUrl] = useState("");
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        console.log("Fetching preview for document:", documentId);
        const response = await fetch(
          `http://localhost:5000/api/chat/decrypt-file/${documentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
          setLoading(false);
          console.log("Preview URL created successfully");
        } else {
          console.error("Failed to load preview:", response.status);
          const errorText = await response.text();
          setError(errorText);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading preview:", error);
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

  const handlePrint = () => {
    setShowPrintDialog(true);
  };

  const isPDF = previewUrl?.includes('pdf');

  return (
    <>
      <div 
        className="w-48 h-32 border rounded overflow-hidden cursor-pointer"
        onClick={handlePrint}
      >
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-sm text-gray-500">Loading preview...</span>
          </div>
        ) : error ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-sm text-red-500">Error loading preview</span>
          </div>
        ) : (
          isPDF ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-sm text-gray-700">PDF Document</span>
            </div>
          ) : (
            <img
              src={previewUrl}
              alt="Document Preview"
              className="w-full h-full object-cover"
              onContextMenu={(e) => e.preventDefault()}
            />
          )
        )}
      </div>

      <Dialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          <div className="w-full h-full relative">
            <iframe
              src={previewUrl}
              className="w-full h-full border-none"
              style={{
                pointerEvents: "none",
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none"
              }}
              sandbox="allow-same-origin allow-scripts"
            />
            <div className="absolute top-4 right-4 space-x-2">
              <button
                onClick={() => {
                  const printWindow = window.open("", "_blank", "width=800,height=600");
                  if (!printWindow) {
                    alert("Please allow pop-ups for printing");
                    return;
                  }

                  printWindow.document.write(`
                    <html>
                      <head>
                        <title>Print Document</title>
                        <style>
                          @media print {
                            @page { margin: 0; }
                            body { margin: 1.6cm; }
                          }
                          body { margin: 0; }
                          iframe { width: 100%; height: 100vh; border: none; }
                        </style>
                      </head>
                      <body>
                        <iframe 
                          src="${previewUrl}" 
                          onload="setTimeout(function() { window.print(); window.close(); }, 500)"
                          style="pointer-events: none;"
                        ></iframe>
                      </body>
                    </html>
                  `);
                  printWindow.document.close();
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Print
              </button>
              <button
                onClick={() => setShowPrintDialog(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default DocumentPreview;
