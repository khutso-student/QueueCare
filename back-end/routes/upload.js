const express = require("express");
const multer = require("multer");
const User = require("../models/User");

const router = express.Router();

// use memory storage to hold the file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload-profile/:id", upload.single("image"), async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString("base64");
    const mimeType = req.file.mimetype;

    const profileImage = `data:${mimeType};base64,${base64Image}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage },
      { new: true }
    );

    res.status(200).json({
      message: "Profile image uploaded successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload profile image" });
  }
});

// Add this to the same file
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ error: "Failed to update user profile" });
  }
});



module.exports = router;
