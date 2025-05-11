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
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: false,
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email:
        !formData.email ||
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
          formData.email
        ),
      password: !formData.password,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).every((err) => !err)) {
      try {
        const response = await axios.post("/auth/login", formData);
        const { token } = response.data;
        localStorage.setItem("token", token);
        navigate("/favorites");
      } catch (err) {
        const msg = err.response?.data?.error || "Error al iniciar sesión";
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
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                helperText={errors.email && "Introduce un correo válido"}
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
                <Button variant="text" onClick={() => navigate("/register")}>
                  Regístrate aquí
                </Button>
              </Typography>
            </Grid>

            <Grid item xs={12} textAlign="left">
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate("/forgot-password")}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" size="large">
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
