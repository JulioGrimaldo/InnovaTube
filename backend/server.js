const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const youtubeRoutes = require('./routes/youtubeRoutes')

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use('/api/youtube', youtubeRoutes)
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes); 

app.get('/', (req, res) => {
  res.send('API de Innovatube corriendo');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
