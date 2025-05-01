const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken'); // Middleware for authentication
const Shop = require('../models/Shop');
const { getUploadedFiles } = require("../controllers/shopController");
// Search for shops by owner
const mongoose = require("mongoose");



router.get('/search', verifyToken, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query parameter is required." });
  }

  try {
    let result;

    // Check if the query looks like a valid ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(query);

    if (isValidObjectId) {
      console.log(`Searching for shop by ID: ${query}`);
      // Search by Shop ID
      const shop = await Shop.findById(query).populate({
        path: 'owner',
        select: 'name email', // Only return specific fields from Owner
      });

      if (!shop) {
        console.log(`No shop found with ID: ${query}`);
        return res.status(404).json({ message: "No shop found with the given ID." });
      }

      console.log("Shop found by ID:", shop);
      result = { shop };
    } else {
      console.log(`Searching for shop by name: ${query}`);
      // Search by Shop Name (case-insensitive)
      const shops = await Shop.find({ name: { $regex: new RegExp(query, 'i') } })
        .populate({
          path: 'owner',
          select: 'name email', // Only return specific fields from Owner
        });

      if (shops.length === 0) {
        console.log(`No shops found with name matching: ${query}`);
        return res.status(404).json({ message: "No shops found with the given name." });
      }

      console.log("Shops found by name:", shops);
      result = { shops };
    }

    res.json(result);
  } catch (error) {
    console.error("Error searching shops:", error);
    res.status(500).json({ message: "Error searching for shops.", error: error.message });
  }
});



  router.get('/:shopId', async (req, res) => {
    const { shopId } = req.params; // Extract the shopId from the URL
    try {
      const shop = await Shop.findById(shopId).populate('owner'); // Fetch the shop by ID and populate owner
      if (!shop) {
        return res.status(404).json({ message: 'Shop not found' });
      }
      res.json({
        shop: {
          _id: shop._id,
          name: shop.name,
          owner: { _id: shop.owner._id, name: shop.owner.name }
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching shop details' });
    }
  });
  router.get("/:shopId/files", getUploadedFiles);

module.exports = router;
