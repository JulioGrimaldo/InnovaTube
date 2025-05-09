const supabase = require('../services/supabase');

// Listar favoritos del usuario
const getFavorites = async (req, res) => {
  const { id: userId } = req.user;

  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId);

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

// Agregar video favorito
const addFavorite = async (req, res) => {
  const { id: userId } = req.user;
  const { video_id, title, thumbnail } = req.body;

  const { data, error } = await supabase
    .from('favorites')
    .insert([{ user_id: userId, video_id, title, thumbnail }]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ message: 'Favorito guardado', data });
};

// Eliminar favorito
const removeFavorite = async (req, res) => {
  const { id: userId } = req.user;
  const { video_id } = req.params;

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('video_id', video_id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Favorito eliminado' });
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
