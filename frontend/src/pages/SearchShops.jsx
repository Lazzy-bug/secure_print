import React, { useState } from "react";
import axios from "axios";
import routes from "../routes";

const SearchShops = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const token = localStorage.getItem("token"); // Get the token from localStorage

    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(routes.searchShops, {
        params: { query },
        headers: {
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });

      setResults(response.data.shops); // Set results
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const handleSelectShop = (shopId) => {
    console.log("Selected shop:", shopId);
    // Navigate to secure communication page or start chat
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search for shops..."
        className="border p-2 w-full"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2 mt-2" onClick={handleSearch}>
        Search
      </button>

      <ul className="mt-4">
        {results.map((shop) => (
          <li key={shop._id} className="p-2 border-b" onClick={() => handleSelectShop(shop._id)}>
            {shop.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchShops;
 