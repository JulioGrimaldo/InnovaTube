const supabase = require("../services/supabase");

// Listar favoritos del usuario
const getFavorites = async (userId) => {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return data;
};

// Agregar video favorito
const addFavorite = async (req, res) => {
  const { id: userId } = req.user;
  const { video_id, title, thumbnail } = req.body;

  // Validar que los datos necesarios estén presentes
  if (!video_id || !title) {
    return res
      .status(400)
      .json({ error: "Faltan datos requeridos (video_id, title)" });
  }

  try {
    // Verificar que el usuario exista en la base de datos
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (userError || !userData) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    // Insertar el favorito en la base de datos
    const { data, error } = await supabase
      .from("favorites")
      .insert([{ user_id: userId, video_id, title, thumbnail }]);

    if (error) {
      console.error("Error al agregar favorito:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: "Favorito guardado", data });
  } catch (err) {
    console.error("Error inesperado:", err);
    res.status(500).json({ error: "Hubo un problema al agregar el favorito" });
  }
};

// Eliminar favorito
const removeFavorite = async (req, res) => {
  const { id: userId } = req.user;
  const { video_id } = req.params;

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("video_id", video_id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Favorito eliminado" });
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
