import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "../api/axiosConfig";

const SearchYoutube = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  // Obtener datos del usuario desde localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  // Cargar favoritos al iniciar
  useEffect(() => {
    const loadFavorites = async () => {
      const token = localStorage.getItem("token");
      const user = getUserData();

      if (!token || !user) return;

      try {
        const response = await axios.get(`/favorites?user_id=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ids = new Set(response.data.map((fav) => fav.video_id));
        setFavoriteIds(ids);
      } catch (err) {
        console.error("Error loading favorites:", err);
      }
    };

    loadFavorites();
  }, []);

  // Función principal de búsqueda
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError({ message: "Por favor ingresa un término de búsqueda" });
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const user = getUserData();
      if (!user) {
        setError({ message: "No se encontró información del usuario" });
        return;
      }

      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const response = await axios.get(
        `/youtube/search?query=${encodeURIComponent(searchQuery)}&username=${
          user.username
        }`,
        config
      );

      // Procesar respuesta según diferentes estructuras posibles
      const receivedVideos = response.data?.videos || response.data || [];

      setVideos(
        receivedVideos.map((video) => ({
          id: video.id?.videoId || video.id,
          title: video.snippet?.title || video.title,
          description: video.snippet?.description || video.description,
          thumbnail: video.snippet?.thumbnails?.medium?.url || video.thumbnail,
          isFavorite: favoriteIds.has(video.id?.videoId || video.id),
        }))
      );
    } catch (err) {
      console.error("Search error:", err);
      setError({
        message: "Error al buscar videos",
        details: err.response?.data?.error || err.message,
      });
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // Manejar favoritos
  const handleFavorite = async (video) => {
    const token = localStorage.getItem("token");
    const user = getUserData();

    if (!token || !user) {
      setError({ message: "Debes iniciar sesión para gestionar favoritos" });
      return;
    }

    const videoId = video.id;
    const isFavorite = favoriteIds.has(videoId);

    try {
      if (isFavorite) {
        await axios.delete(`/favorites/${videoId}`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { user_id: user.id },
        });
      } else {
        await axios.post(
          "/favorites",
          {
            user_id: user.id,
            video_id: videoId,
            title: video.title,
            thumbnail: video.thumbnail,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Actualizar estado local
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        isFavorite ? newSet.delete(videoId) : newSet.add(videoId);
        return newSet;
      });

      // Actualizar estado de videos
      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoId ? { ...v, isFavorite: !isFavorite } : v
        )
      );
    } catch (err) {
      console.error("Favorite error:", err);
      setError({
        message: "Error al actualizar favoritos",
        details: err.response?.data?.error || err.message,
      });
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 4,
        mb: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Formulario de búsqueda */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
          mb: 4,
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <TextField
          label="Buscar videos en YouTube"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, minWidth: "300px" }}
          placeholder="Ejemplo: Contratenme por favor"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ height: 56, minWidth: 120 }}
        >
          {loading ? <CircularProgress size={24} /> : "Buscar"}
        </Button>
      </Box>

      {/* Mensajes de error */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, width: "100%", maxWidth: "800px" }}
        >
          <Typography variant="subtitle1">{error.message}</Typography>
          {error.details && (
            <Typography variant="body2">{error.details}</Typography>
          )}
        </Alert>
      )}

      {/* Resultados en columna única */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {videos.map((video) => (
          <Paper
            key={video.id}
            elevation={3}
            sx={{
              width: "100%",
              p: 3,
              backgroundColor: "#2c2c2c",
              color: "white",
              borderRadius: 2,
            }}
          >
            {/* Título */}
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {video.title}
            </Typography>

            {/* Video */}
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                paddingTop: "56.25%",
                mb: 2,
                backgroundColor: "#000",
              }}
            >
              <Box
                component="iframe"
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                allowFullScreen
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </Box>

            {/* Botón de favoritos */}
            <Button
              fullWidth
              variant="contained"
              color={video.isFavorite ? "error" : "primary"}
              onClick={() => handleFavorite(video)}
              sx={{
                mt: 1,
                py: 1.5,
                fontWeight: "bold",
              }}
            >
              {video.isFavorite
                ? "Quitar de favoritos"
                : "Guardar en favoritos"}
            </Button>
          </Paper>
        ))}
      </Box>

      {/* Estados vacíos */}
      {!loading && videos.length === 0 && searchQuery && !error && (
        <Box
          sx={{ textAlign: "center", mt: 4, width: "100%", maxWidth: "800px" }}
        >
          <Typography variant="h6">
            No se encontraron videos para "{searchQuery}"
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Prueba con términos de búsqueda diferentes
          </Typography>
        </Box>
      )}

      {loading && videos.length === 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
          <CircularProgress size={60} />
        </Box>
      )}
    </Container>
  );
};

export default SearchYoutube;
