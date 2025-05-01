import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserQRCodeReader } from "@zxing/library"; // Import the ZXing library
import { FaCamera, FaSignOutAlt } from "react-icons/fa"; // Import camera and logout icons

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search input value
  const [shopSuggestions, setShopSuggestions] = useState([]); // Suggestions list
  const [selectedShop, setSelectedShop] = useState(null); // Selected shop for communication
  const [scanningQR, setScanningQR] = useState(false); // To control QR scanner visibility
  const [qrData, setQrData] = useState(null); // Store QR scan result (username)
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Reference to the file input element
  const videoRef = useRef(null); // Reference to video element for QR scanner
  const codeReader = useRef(null); // ZXing reader instance

  // Fetch user data and check authorization
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found. Redirecting to login...");
        navigate("/user/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/user/user-dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        });

        if (response.status === 401) {
          console.error("Unauthorized access. Redirecting to login...");
          navigate("/user/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user); // Set user data if available
          } else {
            setError("User data not found in response.");
          }
        } else {
          console.error("Unexpected error:", response.statusText);
          setError("Failed to fetch dashboard data.");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Handle search input change
  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    if (query.length > 2) {
      console.log(`Searching for shops with query: ${query}`);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Redirecting to login...");
          navigate("/user/login");
          return;
        }
  
        const response = await fetch(`http://localhost:5000/api/shops/search?query=${query}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log("Shops found:", data);
  
          // Handle both single shop and multiple shops
          if (data.shop) {
            setShopSuggestions([data.shop]); // Wrap single shop in an array
          } else if (data.shops) {
            setShopSuggestions(data.shops); // Use shops array directly
          } else {
            setShopSuggestions([]); // No shops found
          }
        } else {
          console.error("Failed to fetch shop suggestions:", response.status);
          setShopSuggestions([]); // Clear suggestions if there's an error
        }
      } catch (error) {
        console.error("Error fetching shop suggestions:", error);
        setShopSuggestions([]); // Clear suggestions on error
      }
    } else {
      setShopSuggestions([]); // Clear suggestions if the search query is too short
    }
  };
  

  // Function to select a shop and navigate to the file upload or chat page
  const handleShopSelect = (shop) => {
    setSelectedShop(shop);
    console.log("Selected Shop:", shop); // Handle further actions like opening a chat
    navigate(`/file-upload/${shop._id}`); // Navigate to file upload page with selected shop
  };

  // Handle QR scan result
  const handleQRScan = (result) => {
    if (result) {
      setQrData(result.getText()); // Store scanned data (username or any other info)
      console.log("QR Data:", result.getText());
      setSearchQuery(result.getText()); // Trigger search immediately after scanning QR data
      stopScanner(); // Stop scanning once QR is detected
    }
  };

  // Handle QR scan error
  const handleQRError = (error) => {
    console.error("QR Scan Error:", error);
  };

  // Start QR scanner
  const startScanner = () => {
    if (scanningQR && !codeReader.current) {
      codeReader.current = new BrowserQRCodeReader();
      codeReader.current.decodeOnceFromVideoDevice(null, videoRef.current)
        .then(handleQRScan)
        .catch(handleQRError);
    }
  };

  // Stop QR scanner
  const stopScanner = () => {
    setScanningQR(false); // Hide QR scanner
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop()); // Stop all tracks to turn off the camera
    }
    // Reset the ZXing reader instance
    codeReader.current = null;
  };

  // Handle QR file upload and decode
  const handleQRFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const codeReader = new BrowserQRCodeReader();
      try {
        const result = await codeReader.decodeFromImageUrl(URL.createObjectURL(file));
        handleQRScan(result); // Use the result to populate the search query
      } catch (error) {
        console.error("QR Scan Error:", error);
      } finally {
        // Reset the file input after processing the QR code
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset the file input field
        }
      }
    }
  };

  // Automatically trigger search when qrData changes
  useEffect(() => {
    if (qrData) {
      setSearchQuery(qrData); // Update search query with the QR data
    }
  }, [qrData]);

  useEffect(() => {
    if (searchQuery.length > 2) {
      handleSearchChange({ target: { value: searchQuery } });
    }
  }, [searchQuery]);

  // Start scanner when `scanningQR` is true
  useEffect(() => {
    if (scanningQR) {
      startScanner();
    } else {
      stopScanner(); // Stop the scanner when `scanningQR` is false
    }
  }, [scanningQR]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/user/login");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      {user ? (
        <div>
          <h1>Welcome, {user.email}!</h1>
          <p>User ID: {user.name}</p>

          {/* Search Section */}
          <div className="search-section">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for shops..."
              className="search-bar"
            />
            {/* Display search suggestions */}
            {shopSuggestions.length > 0 && (
              <ul className="suggestions">
                {shopSuggestions.map((shop) => (
                  <li
                    key={shop._id}
                    className="suggestion-item"
                    onClick={() => handleShopSelect(shop)}
                  >
                    <span className="shop-name">{shop.name}</span> 
                    <span className="shop-id"> (ID: {shop._id})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* QR Code Scanner */}
          <div className="qr-scanner-section">
            <button
              className="scan-qr-button"
              onClick={() => setScanningQR(!scanningQR)} // Toggle scanner visibility
            >
              <FaCamera /> Scan QR Code
            </button>
            {scanningQR && (
              <div>
                <video ref={videoRef} width="100%" height="auto" style={{ border: "1px solid #ddd" }}></video>
              </div>
            )}
            {qrData && <div>Scanned QR Data: {qrData}</div>} {/* Display scanned QR data */}
          </div>

          {/* Upload QR Code from File */}
          <div className="qr-file-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleQRFileUpload}
              ref={fileInputRef}
            />
          </div>

          {/* Logout Button */}
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
};

export default UserDashboard;
