import { DocumentPreview } from "./DocumentPreview";

export const DocumentTable = ({ documents, handlePrint, token }) => {
  if (documents.length === 0) {
    return <p className="text-gray-500 mt-4">No documents found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full mt-4">
        <thead>
          <tr>
            <th className="text-left p-4">Preview</th>
            <th className="text-left p-4">Sender</th>
            <th className="text-left p-4">Received At</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document._id} className="border-t">
              <td className="p-4">
                <DocumentPreview documentId={document._id} token={token} />
              </td>
              <td className="p-4">{document.senderName}</td>
              <td className="p-4">
                {new Date(document.timestamp).toLocaleString()}
              </td>
              <td className="p-4">
                <button
                  onClick={() => handlePrint(document._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Print
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};