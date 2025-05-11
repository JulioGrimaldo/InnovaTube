import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "", // Cambiado de 'email' a 'identifier'
    password: "",
  });

  const [errors, setErrors] = useState({
    identifier: false,
    password: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: false,
    });
    setErrorMessage(""); // Limpiar mensajes de error al cambiar los campos
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación simplificada
    const newErrors = {
      identifier: !formData.identifier,
      password: !formData.password,
    };

    setErrors(newErrors);

    if (!newErrors.identifier && !newErrors.password) {
      try {
        const response = await axios.post("/auth/login", formData);

        if (response.data.success) {
          const { token, user } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/home"); // Asegúrate que la ruta sea correcta (case-sensitive)
        } else {
          setErrorMessage(
            response.data.error || "Error en el inicio de sesión"
          );
        }
      } catch (err) {
        console.error("Error en login:", err);
        const msg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Error al conectar con el servidor";
        setErrorMessage(msg);
      }
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Iniciar Sesión
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2} direction="column">
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Correo Electrónico o Usuario"
                name="identifier" // Cambiado de 'email' a 'identifier'
                value={formData.identifier}
                onChange={handleChange}
                error={errors.identifier}
                helperText={errors.identifier && "Este campo es requerido"}
                autoComplete="username"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                helperText={errors.password && "La contraseña es requerida"}
                autoComplete="current-password"
              />
            </Grid>

            {errorMessage && (
              <Grid item xs={12}>
                <Typography color="error" align="center">
                  {errorMessage}
                </Typography>
              </Grid>
            )}

            <Grid item xs={12} textAlign="center">
              <Typography variant="body2">
                ¿No tienes una cuenta?{" "}
                <Button
                  variant="text"
                  onClick={() => navigate("/register")}
                  sx={{ textTransform: "none" }}
                >
                  Regístrate aquí
                </Button>
              </Typography>
            </Grid>

            <Grid item xs={12} textAlign="left">
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/forgot-password")}
                sx={{ textDecoration: "none" }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
              >
                Entrar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
