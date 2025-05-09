const { searchVideos } = require('../services/youtubeServices');

const searchVideosController = async (req, res) => {
  const { query } = req.query;  // Obtener el término de búsqueda de los parámetros de la solicitud

  if (!query) {
    return res.status(400).json({ error: 'El término de búsqueda es requerido' });
  }

  try {
    const videos = await searchVideos(query);
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error al buscar los videos' });
  }
};

module.exports = { searchVideosController };
