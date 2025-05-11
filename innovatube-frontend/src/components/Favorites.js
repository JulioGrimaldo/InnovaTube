import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import axios from "../api/axiosConfig";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(response.data);
      } catch (err) {
        console.error("Error al cargar favoritos", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (videoId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/favorites/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prev) => prev.filter((item) => item.video_id !== videoId));
    } catch (err) {
      console.error("Error al eliminar favorito", err);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mis Favoritos
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : favorites.length === 0 ? (
        <Typography>No tienes videos favoritos aún.</Typography>
      ) : (
        <Grid container spacing={2}>
          {favorites.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video.video_id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={video.thumbnail}
                  alt={video.title}
                />
                <CardContent>
                  <Typography variant="subtitle1">{video.title}</Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    onClick={() => handleToggleFavorite(video.video_id)}
                    color="error"
                  >
                    <Favorite />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FavoritesPage;
