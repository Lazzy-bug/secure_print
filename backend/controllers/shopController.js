    const UploadedFile = require("../models/UploadedFile");

    const getUploadedFiles = async (req, res) => {
    try {
        const files = await UploadedFile.find({ shopId: req.params.shopId })
        .populate("userId", "name email") // Populate user info
        .sort({ uploadedAt: -1 }); // Sort by upload date
        res.status(200).json(files);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch files" });
    }
    };

    module.exports = { getUploadedFiles };
