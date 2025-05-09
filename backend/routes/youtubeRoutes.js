const express = require('express');
const router = express.Router();
const { searchVideosController } = require('../controllers/youtubeController');

router.get('/search', searchVideosController);

module.exports = router;
