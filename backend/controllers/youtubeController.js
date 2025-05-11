const { searchVideos } = require("../services/youtubeServices");
const supabase = require("../services/supabase");

const searchVideosController = async (req, res) => {
  const { query } = req.query;
  const userId = req.user?.id; // Extraído del token JWT validado

  // Validación mejorada
  if (!query) {
    return res.status(400).json({
      error: "Query parameter is required",
      details: "No search term provided",
    });
  }

  try {
    // 1. Buscar videos en YouTube
    const youtubeResults = await searchVideos(query);

    // 2. Si el usuario está autenticado, buscar sus favoritos
    let favoriteIds = [];
    if (userId) {
      console.log(userId);
      const { data, error } = await supabase
        .from("favorites")
        .select("video_id")
        .eq("user_id", userId);

      if (!error) favoriteIds = data.map((item) => item.video_id);
    }

    // 3. Combinar resultados
    const videos = youtubeResults.map((video) => ({
      ...video,
      isFavorite: favoriteIds.includes(video.id.videoId),
    }));

    res.json(videos);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      error: "Error searching videos",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = { searchVideosController };
