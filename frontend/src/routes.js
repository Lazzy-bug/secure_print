const BASE_URL = "http://localhost:5000/api"; // Update this with your server URL

export const routes = {
  searchShops: `${BASE_URL}/shops/search`, // Endpoint for searching shops
  startCommunication: `${BASE_URL}/chat/start`, // Start secure communication
  sendMessage: `${BASE_URL}/chat/message`, // Send a chat message
  fetchMessages: `${BASE_URL}/chat/messages`, // Fetch chat messages
  uploadFile: `${BASE_URL}/files/upload`, // Upload a document
};

export default routes;
