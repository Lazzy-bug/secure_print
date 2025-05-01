import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

import { FaQrcode } from "react-icons/fa";

const OwnerDashboard = () => {
  const [owner, setOwner] = useState(null);
  const [shopId, setShopId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch owner details from session
  useEffect(() => {
    const fetchOwnerData = async () => {
      if (!token) {
        console.error("No token found");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/owner/owner-dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          console.error("Unauthorized access");
          navigate("/login");
          return;
        }

        setOwner(response.data.owner);
      } catch (error) {
        console.error("Error fetching owner data:", error);
      }
      setLoading(false);
    };

    fetchOwnerData();
  }, [navigate, token]);

  // Fetch shop ID from backend
  useEffect(() => {
    const fetchShopId = async () => {
      if (owner?._id) {
        try {
          const response = await axios.get(`http://localhost:5000/api/shop/${owner._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            setShopId(response.data.shopId); // Assuming response contains shopId
          } else {
            console.error("Failed to fetch shop ID");
          }
        } catch (error) {
          console.error("Error fetching shop ID:", error);
        }
      }
    };

    fetchShopId();
  }, [owner, token]);

  // QR Code download function
  const downloadQRCode = (data, filename) => {
    const canvas = document.getElementById(data);
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.png`;
    link.click();
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!owner) {
    return <h1>Owner details could not be loaded.</h1>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {owner?.name}!</h1>
      <p className="mb-2">Username: {owner?.username}</p>
      <p className="mb-6">Shop Name: {owner?.shopName}</p>

      <div className="mb-4 flex flex-col gap-4">
        {/* QR Code for Shop Name */}
        <div className="flex items-center gap-4">
          <QRCode id="shop-name" value={owner?.shopName} size={128} />
          <button
            onClick={() => downloadQRCode("shop-name", "shop-name")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
          >
            <FaQrcode />
            Download QR Code (Shop Name)
          </button>
        </div>

        {/* QR Code for Shop ID */}
        {shopId && (
          <div className="flex items-center gap-4">
            <QRCode id="shop-id" value={shopId} size={128} />
            <button
              onClick={() => downloadQRCode("shop-id", "shop-id")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
            >
              <FaQrcode />
              Download QR Code (Shop ID)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
