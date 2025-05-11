import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import axios from "../api/axiosConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Por favor ingresa un correo válido.");
      return;
    }

    try {
      // Aquí llamas a tu backend
      await axios.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      const msg =
        err.response?.data?.error || "Error al solicitar recuperación";
      setError(msg);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Recuperar Contraseña
        </Typography>
        {submitted ? (
          <Typography align="center" color="primary">
            Si tu correo está registrado, recibirás instrucciones para recuperar
            tu contraseña.
          </Typography>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2} direction="column">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  error={!!error}
                  helperText={error}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                >
                  Enviar
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
