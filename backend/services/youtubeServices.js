const axios = require("axios");
require("dotenv").config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

// Buscar videos en YouTube

const searchVideos = async (query) => {
  try {
    const response = await axios.get(YOUTUBE_API_URL, {
      params: {
        part: "snippet",
        q: query,
        key: YOUTUBE_API_KEY,
        maxResults: 10,
        type: "video",
      },
    });
    return response.data.items; // Devuelve los videos encontrados
  } catch (error) {
    console.error("Error buscando videos:", error);
    throw new Error("No se pudieron obtener los videos");
  }
};

module.exports = { searchVideos };
