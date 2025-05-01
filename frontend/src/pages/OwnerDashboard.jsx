import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DocumentTable } from "@/components/document/DocumentTable";
import { FaQrcode, FaSignOutAlt } from "react-icons/fa";
import "./owner.css";

const OwnerDashboard = () => {
  const [owner, setOwner] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOwnerData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/owner/owner-dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          console.error("Unauthorized access");
          navigate("/owner/login");
          return;
        }

        if (response.ok) {
          const ownerData = await response.json();
          setOwner(ownerData.owner);
        } else {
          throw new Error("Failed to load owner data");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, [navigate, token]);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (owner?._id) {
        try {
          const { data } = await axios.get(
            `http://localhost:5000/api/chat/received-documents/${owner._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setDocuments(data.documents);
        } catch (error) {
          console.error("Error fetching documents:", error);
        }
      }
    };

    if (owner) fetchDocuments();
  }, [owner, token]);

  const handleQRCodeDownload = async (type) => {
    try {
      const endpoint = `http://localhost:5000/api/owner/qr-code/${type}`;
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { qrCode } = response.data;
      const link = document.createElement("a");
      link.href = qrCode;
      link.download = `qr-code-${type}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  const handlePrint = async (documentId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/chat/decrypt-file/${documentId}`,
        { responseType: "blob", headers: { Authorization: `Bearer ${token}` } }
      );

      const decryptedBlob = response.data;
      const decryptedUrl = URL.createObjectURL(decryptedBlob);

      const contentType = decryptedBlob.type;
      const printWindow = window.open(decryptedUrl, "_blank", "width=800,height=600");

      if (!printWindow) {
        throw new Error("Pop-up blocked. Please allow pop-ups for printing.");
      }

      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          setTimeout(() => {
            printWindow.close();
            URL.revokeObjectURL(decryptedUrl);
          }, 10000);
        }, 1000);
      };

      setTimeout(async () => {
        try {
          await axios.delete(`http://localhost:5000/api/chat/delete-document/${documentId}`);
          setDocuments((prev) => prev.filter((doc) => doc._id !== documentId));
        } catch (error) {
          console.error("Error deleting document:", error);
        }
      }, 30000);
    } catch (error) {
      console.error("Error handling print:", error);
    }
  };

  useEffect(() => {
    const blockKeys = (event) => {
      const blockedKeys = [123, 44, 80, 83, 73, 74, 85];
      if (blockedKeys.includes(event.keyCode) || (event.ctrlKey && event.shiftKey)) {
        event.preventDefault();
        alert("This action is disabled!");
      }
    };

    const blockContextMenu = (event) => event.preventDefault();

    document.addEventListener("keydown", blockKeys);
    document.addEventListener("contextmenu", blockContextMenu);

    return () => {
      document.removeEventListener("keydown", blockKeys);
      document.removeEventListener("contextmenu", blockContextMenu);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (owner?._id) {
        axios
          .get(`http://localhost:5000/api/chat/received-documents/${owner._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(({ data }) => setDocuments(data.documents))
          .catch((error) => console.error("Error fetching new documents:", error));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [owner, token]);

  if (loading) return <h1>Loading...</h1>;
  if (!owner) return <h1>Owner details could not be loaded.</h1>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/owner/login");
  };

  return (
    <div className="dashboard-container p-6">
      <div className="logout-container">
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-4">Welcome, {owner?.name}!</h1>
      <p className="mb-2">Username: {owner?.username}</p>
      <p className="mb-6">Shop Name: {owner?.shopName}</p>

      <div className="mb-4 flex gap-4">
        <button
          onClick={() => handleQRCodeDownload("shop-id")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
        >
          <FaQrcode />
          Download QR Code (Shop ID)
        </button>

        <button
          onClick={() => handleQRCodeDownload("shop-name")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
        >
          <FaQrcode />
          Download QR Code (Shop Name)
        </button>
      </div>

      <DocumentTable documents={documents} handlePrint={handlePrint} token={token} />
    </div>
  );
};

export default OwnerDashboard;
