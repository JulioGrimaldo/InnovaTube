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

const FavoritesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener datos de autenticación
  const getAuthData = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      console.log("");
      return { user, token };
    } catch (error) {
      console.error("Error getting auth data:", error);
      return { user: null, token: null };
    }
  };

  // Obtener favoritos del usuario
  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);

    try {
      const { user, token } = getAuthData();

      if (!user || !token) {
        throw new Error("Debes iniciar sesión para ver tus favoritos");
      }

      const response = await axios.get("/favorites", {
        headers: { Authorization: `Bearer ${token}` },
        params: { user_id: user.id },
      });

      if (!response.data || !response.data.success) {
        throw new Error(
          response.data?.error || "Respuesta inválida del servidor"
        );
      }

      const favoritesData = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      const formattedFavorites = favoritesData.map((fav) => ({
        id: fav.id || fav.video_id,
        video_id: fav.video_id,
        title: fav.title || "Título no disponible",
        description:
          fav.description ||
          `Video favorito añadido el ${new Date(
            fav.created_at
          ).toLocaleDateString()}`,
        thumbnail: fav.thumbnail || "",
        created_at: fav.created_at,
      }));

      setFavorites(formattedFavorites);
    } catch (err) {
      console.error("Error al cargar favoritos:", err);
      setError({
        message: "Error al cargar favoritos",
        details: err.response?.data?.error || err.message,
      });
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar favorito
  const handleRemoveFavorite = async (videoId) => {
    try {
      const { user, token } = getAuthData();

      if (!user || !token) {
        throw new Error("Debes iniciar sesión para esta acción");
      }

      await axios.delete(`/favorites/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { user_id: user.id },
      });

      setFavorites((prev) => prev.filter((fav) => fav.video_id !== videoId));
    } catch (err) {
      console.error("Error al eliminar favorito:", err);
      setError({
        message: "Error al eliminar favorito",
        details: err.response?.data?.error || err.message,
      });
    }
  };

  // Cargar favoritos al montar el componente
  useEffect(() => {
    fetchFavorites();
  }, []);

  // Filtrar favoritos según búsqueda
  const filteredFavorites = favorites.filter(
    (fav) =>
      fav.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fav.description &&
        fav.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Renderizado condicional
  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{ display: "flex", justifyContent: "center", mt: 4 }}
      >
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body1">{error.message}</Typography>
          {error.details && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {error.details}
            </Typography>
          )}
        </Alert>
        <Button variant="contained" onClick={fetchFavorites} sx={{ mt: 2 }}>
          Reintentar
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Barra de búsqueda simplificada */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Buscar en mis favoritos"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={favorites.length === 0}
        />
      </Box>

      {/* Lista de favoritos */}
      {filteredFavorites.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {filteredFavorites.map((favorite) => (
            <Paper
              key={`${favorite.video_id}-${favorite.id}`}
              elevation={3}
              sx={{ p: 3 }}
            >
              <Typography variant="h6" gutterBottom>
                {favorite.title}
              </Typography>

              {favorite.description && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {favorite.description}
                </Typography>
              )}

              {/* Video embed */}
              <Box sx={{ position: "relative", pt: "56.25%", mb: 2, mt: 2 }}>
                {favorite.thumbnail ? (
                  <img
                    src={favorite.thumbnail}
                    alt={favorite.title}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Typography variant="body1">
                      Miniatura no disponible
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Botón de eliminar */}
              <Button
                fullWidth
                variant="contained"
                color="error"
                onClick={() => handleRemoveFavorite(favorite.video_id)}
                sx={{ mt: 1 }}
              >
                Eliminar de favoritos
              </Button>
            </Paper>
          ))}
        </Box>
      ) : (
        <Box textAlign="center" py={4}>
          <Typography variant="h6">
            {searchQuery
              ? `No se encontraron favoritos para "${searchQuery}"`
              : "No tienes videos favoritos aún"}
          </Typography>
          {!searchQuery && (
            <Button variant="contained" sx={{ mt: 2 }} onClick={fetchFavorites}>
              Recargar lista
            </Button>
          )}
        </Box>
      )}
    </Container>
  );
};

export default FavoritesPage;
