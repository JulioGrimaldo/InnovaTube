const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { PORT, ORIGIN } = require("./config");
const authRoutes = require("./routes/authRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const youtubeRoutes = require("./routes/youtubeRoutes");

const app = express();
app.use(
  cors({
    origin: ORIGIN, // Solo este origen puede acceder
    credentials: true, // Permitir el uso de cookies/cabeceras de auth
  })
);
app.use(express.json());

app.use("/api/youtube", youtubeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoriteRoutes);
//app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("API de Innovatube corriendo");
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT || 5000}`);
});
