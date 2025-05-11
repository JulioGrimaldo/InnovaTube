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
  const [searchQuery, setSearchQuery] = useState(""); // Para la barra de búsqueda
  const [videos, setVideos] = useState([]); // Listado de videos
  const [loading, setLoading] = useState(false); // Cargando cuando buscamos

  const handleSearch = async () => {
    setLoading(true);
    try {
      // Aquí puedes integrar la llamada a la API de YouTube o usar un mock de ejemplo.
      const response = await axios.get(
        `/api/youtube/search?query=${searchQuery}`
      );
      setVideos(response.data.items); // Guarda los videos en el estado
    } catch (err) {
      console.error("Error buscando videos:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Bienvenido a InnovaTube
        </Typography>

        {/* Barra de búsqueda */}
        <Box
          sx={{ display: "flex", justifyContent: "center", marginBottom: 3 }}
        >
          <TextField
            label="Buscar videos"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: "60%" }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ marginLeft: 2 }}
            disabled={loading}
          >
            {loading ? "Buscando..." : "Buscar"}
          </Button>
        </Box>

        {/* Listado de videos */}
        {loading ? (
          <Typography align="center">Cargando...</Typography>
        ) : (
          <Grid container spacing={3}>
            {videos.length > 0 ? (
              videos.map((video) => (
                <Grid item xs={12} sm={6} md={4} key={video.id}>
                  <Paper elevation={2} sx={{ padding: 2 }}>
                    <Typography variant="h6">{video.title}</Typography>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      style={{
                        width: "100%",
                        height: "auto",
                        marginBottom: 10,
                      }}
                    />
                    <Button variant="contained" color="secondary" fullWidth>
                      Ver Video
                    </Button>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Typography align="center" sx={{ width: "100%" }}>
                No se encontraron videos.
              </Typography>
            )}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default Home;
