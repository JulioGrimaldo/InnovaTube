const supabase = require("../services/supabase");

// Listar favoritos del usuario
const getFavorites = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const { data, error } = await supabase
      .from("favorites")
      .select(
        `
        id,
        video_id,
        title,
        thumbnail,
        created_at
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Asegurar que siempre devolvemos un array
    const favorites = Array.isArray(data) ? data : [];

    res.json({
      success: true,
      data: favorites, // Estructura consistente
      count: favorites.length,
    });
  } catch (err) {
    console.error("Error en getFavorites:", err);
    res.status(500).json({
      success: false,
      error: "Error al obtener favoritos",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

const addFavorite = async (req, res) => {
  const { id: userId } = req.user;
  const { video_id, title, thumbnail } = req.body;

  // Validación mejorada de campos requeridos
  if (!video_id || !title || !thumbnail) {
    return res.status(400).json({
      success: false,
      error: "Datos incompletos",
      details: {
        required: ["video_id", "title", "thumbnail"],
        received: req.body,
      },
    });
  }

  try {
    const { data: existing, error: fetchError } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("video_id", video_id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "El video ya estaba en favoritos",
        favorite: existing,
      });
    }

    // Insertar nuevo favorito
    const { data: newFavorite, error: insertError } = await supabase
      .from("favorites")
      .insert([
        {
          user_id: userId,
          video_id,
          title,
          thumbnail,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(201).json({
      success: true,
      message: "Favorito agregado exitosamente",
      data: newFavorite,
    });
  } catch (err) {
    console.error("Error en addFavorite:", err);
    res.status(500).json({
      success: false,
      error: "Error al agregar favorito",
      details:
        process.env.NODE_ENV === "development"
          ? {
              message: err.message,
              stack: err.stack,
            }
          : undefined,
    });
  }
};

const removeFavorite = async (req, res) => {
  const { id: userId } = req.user;
  const { video_id } = req.params;

  try {
    const { data, error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("video_id", video_id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Favorito no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Favorito eliminado exitosamente",
      data: data[0],
    });
  } catch (err) {
    console.error("Error en removeFavorite:", err);
    res.status(500).json({
      success: false,
      error: "Error al eliminar favorito",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};
