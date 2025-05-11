import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import axios from "../api/axiosConfig";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState(new Set());

  // Función de búsqueda
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Por favor ingresa un término de búsqueda");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const resp = await axios.get(
        `/youtube/search?query=${encodeURIComponent(searchQuery)}`
      );
      console.log(resp.data);

      if (resp.data && Array.isArray(resp.data)) {
        const videos = resp.data.map((item) => ({
          id: {
            videoId: item.id.videoId,
          },
          snippet: {
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnails: {
              default: {
                url:
                  item.snippet.thumbnails?.default?.url ||
                  "default_thumbnail_url",
              },
            },
          },
        }));
        setVideos(videos);
      } else {
        setVideos([]);
        setError("No se encontraron videos.");
      }
    } catch (err) {
      console.error(err);
      setError("Error al buscar videos");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar a favoritos
  const handleAddFavorite = async (video) => {
    const { videoId, title, thumbnail } = video;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }

    try {
      const response = await axios.post(
        "/favorites",
        { video_id: videoId, title: title, thumbnail: thumbnail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Favorito agregado", response.data);
      setFavorites((prevFavorites) => new Set(prevFavorites.add(videoId)));
    } catch (err) {
      console.error(
        "Error al agregar a favoritos:",
        err.response?.data || err.message
      );
    }
  };

  // Función para eliminar de favoritos
  const handleRemoveFavorite = async (videoId) => {
    try {
      await axios.delete(`/favorites/${videoId}`);
      setFavorites((prevFavorites) => {
        const updatedFavorites = new Set(prevFavorites);
        updatedFavorites.delete(videoId);
        return updatedFavorites;
      });
    } catch (err) {
      console.error("Error al eliminar de favoritos", err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
        }}
      >
        <TextField
          label="Buscar videos"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, minWidth: "300px", maxWidth: "600px" }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ height: 56 }}
        >
          {loading ? "Buscando..." : "Buscar"}
        </Button>
      </Box>
      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Typography align="center">Cargando...</Typography>
      ) : videos.length > 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Grid
            container
            spacing={4}
            direction="column"
            alignItems="center"
            sx={{ width: "100%", maxWidth: "800px" }}
          >
            {videos.map((video) => (
              <Grid item key={video.id.videoId} xs={12} sx={{ width: "100%" }}>
                <Paper
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
                    {video.snippet.title}
                  </Typography>

                  {/* Video (iframe) */}
                  <Box
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      paddingTop: "56.25%", // 16:9 aspect ratio
                      mb: 2,
                    }}
                  >
                    <Box
                      component="iframe"
                      src={`https://www.youtube.com/embed/${video.id.videoId}`}
                      title={video.snippet.title}
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
                    color={
                      favorites.has(video.id.videoId) ? "error" : "primary"
                    }
                    onClick={() =>
                      favorites.has(video.id.videoId)
                        ? handleRemoveFavorite(video.id.videoId)
                        : handleAddFavorite({
                            videoId: video.id.videoId,
                            title: video.snippet.title,
                            thumbnail: video.snippet.thumbnails.default.url,
                          })
                    }
                    sx={{
                      mt: 1,
                      py: 1.5,
                      fontWeight: "bold",
                    }}
                  >
                    {favorites.has(video.id.videoId)
                      ? "Quitar de favoritos"
                      : "Guardar en favoritos"}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Typography align="center">No se encontraron videos.</Typography>
      )}
    </Container>
  );
};

export default Home;
