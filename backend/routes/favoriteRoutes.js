const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favoriteController");

// Listar favoritos
router.get("/", verifyToken, getFavorites);
router.post("/", verifyToken, addFavorite);
router.delete("/:video_id", verifyToken, removeFavorite);
module.exports = router;
