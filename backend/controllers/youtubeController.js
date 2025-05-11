const { searchVideos } = require("../services/youtubeServices");
const supabase = require("../services/supabase");

const searchVideosController = async (req, res) => {
  const { query } = req.query;
  const { id: userId } = req.user; // Asumiendo que usas autenticación JWT
  console.log("id", userId);
  if (!query) {
    return res
      .status(400)
      .json({ error: "El término de búsqueda es requerido" });
  }

  try {
    // 1. Buscar videos en YouTube
    const videos = await searchVideos(query);

    // 2. Obtener favoritos del usuario
    const { data: favorites, error } = await supabase
      .from("favorites")
      .select("video_id")
      .eq("user_id", userId);

    if (error) throw error;

    // 3. Crear Set con IDs de favoritos para búsqueda rápida
    const favoriteIds = new Set(favorites.map((fav) => fav.video_id));

    // 4. Enriquecer los videos con información de favoritos
    const videosWithFavorites = videos.map((video) => ({
      ...video,
      isFavorite: favoriteIds.has(video.id.videoId),
    }));

    res.json(videosWithFavorites);
  } catch (error) {
    console.error("Error en searchVideosController:", error);
    res.status(500).json({ error: "Hubo un error al buscar los videos" });
  }
};

module.exports = { searchVideosController };
